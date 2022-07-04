import axios, { AxiosRequestConfig } from "axios";
import { do_retry_task } from "./core";

type RequestInterceptor = {
    fn: (config: Omit<AxiosRequestConfig, 'signal'>) => void
}
type ResponseInterceptor = {
    fulfill: (res: any) => void
    reject: (err: any) => void
}

class UseAxios {
    /**
     * @description 全局配置
     */
    readonly #global_config: Omit<AxiosRequestConfig, 'signal'>

    constructor(global_config: Omit<AxiosRequestConfig, 'signal'> = {}) {
        this.#global_config = global_config
    }

    /**
     * @description 请求拦截器
     */
    #request_interceptors = new Map<string, RequestInterceptor>()
    /**
     * @description 获取当前实例中的所有请求拦截器名称
     */
    get request_interceptors() {
        return [ ...this.#request_interceptors.keys() ]
    }

    /**
     * @description 响应拦截器
     */
    #response_interceptors = new Map<string, ResponseInterceptor>()
    /**
     * @description 获取当前实例中的所有响应拦截器名称
     */
    get response_interceptors() {
        return [ ...this.#response_interceptors.keys() ]
    }

    /**
     * @description 添加请求拦截器
     * @param name 标识
     * @param interceptor 拦截器
     */
    add_request_interceptor(name: string, interceptor: RequestInterceptor) {
        this.#request_interceptors.set(name, interceptor)
    }

    /**
     * @description 移除请求拦截器
     * @param name 拦截器名称
     */
    remove_request_interceptor(name: string) {
        this.#request_interceptors.delete(name)
    }

    /**
     * @description 清空请求拦截器
     */
    clear_request_interceptor() {
        this.#request_interceptors.clear()
    }

    /**
     * @description 添加响应拦截器
     * @param name 标识
     * @param interceptor 拦截器
     */
    set_response_interceptor(name: string, interceptor: ResponseInterceptor) {
        this.#response_interceptors.set(name, interceptor)
    }

    /**
     * @description 移除响应拦截器
     * @param name 拦截器名称
     */
    remove_response_interceptor(name: string) {
        this.#response_interceptors.delete(name)
    }

    /**
     * @description 清空响应拦截器
     */
    clear_response_interceptor() {
        this.#response_interceptors.clear()
    }

    /**
     * @description 取消请求的 token 索引
     */
    readonly #scopes = new Map<string, AbortController>()
    /**
     * @description 获取当前实例中的所有 scope
     */
    get scopes() {
        return [ ...this.#scopes.keys() ]
    }

    /**
     * @description 取消某个 scope 的请求
     */
    cancel_scope(scope: string, message: string = '') {
        this.#scopes.get(scope)?.abort(message)
        this.#scopes.delete(scope)
    }

    /**
     * @description 取消某些 scope 的请求
     */
    cancel_scopes(...scopes: string[]) {
        scopes.forEach(scope => {
            this.cancel_scope(scope)
        })
    }

    /**
     * @description 取消全部 scope 的请求
     */
    cancel_all() {
        this.#scopes.forEach(canceller => {
            canceller.abort()
        })
        this.#scopes.clear()
    }

    /**
     * @description 是否主动取消请求
     */
    static isCancel = (err: any) => {
        return axios.isCancel(err) || err instanceof DOMException && err.name === 'AbortError'
    }
    /**
     * @description 是否主动取消请求
     */
    public isCancel: (err: any) => boolean = axios.isCancel

    /**
     * @description 若存在该 scope 则直接返回, 否则插入并返回新值
     */
    private entry_or_insert(scope: any) {
        // 若无此 scope 对应的 token, 则生成
        if(!this.#scopes.has(scope)) this.#scopes.set(scope, new AbortController())

        // 此时确保有 scope 对应的 token, 获取
        return this.#scopes.get(scope)!
    }

    /**
     * @description `GET`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param config 请求参数 (同 axios, 但不允许配置 'signal' 字段)
     */
    get(scope: string, url: string, config?: Omit<AxiosRequestConfig, 'signal'>) {
        // 获取 token
        const token_for_scope = this.entry_or_insert(scope)

        // 应用请求拦截器
        if(!!config) {
            this.#request_interceptors.forEach((interceptor) => {
                interceptor.fn(config)
            })
        }

        // 返回与此 token 绑定的请求实例
        return new Promise((resolve, reject) => {
            axios.get(url, { ...(config ?? this.#global_config), signal: token_for_scope.signal })
                .then(res => {
                    // 应用响应拦截器 - 成功
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.fulfill(res)
                    })
                    resolve(res)
                })
                .catch(err => {
                    // 应用响应拦截器 - 失败
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.reject(err)
                    })
                    reject(err)
                })
        })
    }

    /**
     * @description `GET`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    get_retry(scope: string, retry: number = 1, url: string, config?: Omit<AxiosRequestConfig, 'signal'>) {
        return do_retry_task(
            retry,
            this.get,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `POST`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 axios, 但不允许配置 'signal' 字段)
     */
    post(scope: string, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>) {
        // 获取 token
        const token_for_scope = this.entry_or_insert(scope)

        // 应用请求拦截器
        if(!!config) {
            this.#request_interceptors.forEach((interceptor) => {
                interceptor.fn(config)
            })
        }

        // 返回与此 token 绑定的请求实例
        return new Promise((resolve, reject) => {
            axios.post(url, data, {
                    ...(config ?? this.#global_config),
                    signal: token_for_scope.signal
                })
                .then(res => {
                    // 应用响应拦截器 - 成功
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.fulfill(res)
                    })
                    resolve(res)
                })
                .catch(err => {
                    // 应用响应拦截器 - 失败
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.reject(err)
                    })
                    reject(err)
                })
        })
    }

    /**
     * @description `POST`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    post_retry(scope: string, retry: number, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>) {
        return do_retry_task(
            retry,
            this.post,
            [ scope, url, data, config ],
            this.isCancel
        )
    }

    /**
     * @description `DELETE`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param config 请求参数 (同 axios, 但不允许配置 'signal' 字段)
     */
    delete(scope: string, url: string, config?: Omit<AxiosRequestConfig, 'signal'>) {
        // 获取 token
        const token_for_scope = this.entry_or_insert(scope)

        // 应用请求拦截器
        if(!!config) {
            this.#request_interceptors.forEach((interceptor) => {
                interceptor.fn(config)
            })
        }

        // 返回与此 token 绑定的请求实例
        return new Promise((resolve, reject) => {
            axios.delete(url, { ...(config ?? this.#global_config), signal: token_for_scope.signal })
                .then(res => {
                    // 应用响应拦截器 - 成功
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.fulfill(res)
                    })
                    resolve(res)
                })
                .catch(err => {
                    // 应用响应拦截器 - 失败
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.reject(err)
                    })
                    reject(err)
                })
        })
    }

    /**
     * @description `DELETE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    delete_retry(scope: string, retry: number, url: string, config?: Omit<AxiosRequestConfig, 'signal'>) {
        return do_retry_task(
            retry,
            this.delete,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `PUT`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 axios, 但不允许配置 'signal' 字段)
     */
    put(scope: string, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>) {
        // 获取 token
        const token_for_scope = this.entry_or_insert(scope)

        // 应用请求拦截器
        if(!!config) {
            this.#request_interceptors.forEach((interceptor) => {
                interceptor.fn(config)
            })
        }

        // 返回与此 token 绑定的请求实例
        return new Promise((resolve, reject) => {
            axios.put(url, data, { ...(config ?? this.#global_config), signal: token_for_scope.signal })
                .then(res => {
                    // 应用响应拦截器 - 成功
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.fulfill(res)
                    })
                    resolve(res)
                })
                .catch(err => {
                    // 应用响应拦截器 - 失败
                    this.#response_interceptors.forEach(interceptor => {
                        interceptor.reject(err)
                    })
                    reject(err)
                })
        })
    }

    /**
     * @description `PUT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    put_retry(scope: string, retry: number, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>) {
        return do_retry_task(
            retry,
            this.put,
            [ scope, url, data, config ],
            this.isCancel
        )
    }
}

export {
    UseAxios
}