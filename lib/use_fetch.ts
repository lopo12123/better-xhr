import { do_retry_task, RequestType } from "./core";

export type RequestInterceptor = {
    fn: (config: Omit<RequestInit, 'signal' | 'method'>) => void
}
export type ResponseInterceptor = {
    fulfill: (res: Response) => void
    reject: (err: any) => void
}

class UseFetch {
    /**
     * @description 全局配置
     */
    #global_config: Omit<RequestInit, 'signal' | 'method'>

    constructor(global_config: Omit<RequestInit, 'signal' | 'method'> = {}) {
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
    add_response_interceptor(name: string, interceptor: ResponseInterceptor) {
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
        return err instanceof DOMException && err.name === 'AbortError'
    }
    /**
     * @description 是否主动取消请求
     */
    public isCancel = (err: any) => {
        return err instanceof DOMException && err.name === 'AbortError'
    }

    /**
     * @description 若存在该 scope 则直接返回, 否则插入并返回新值
     */
    private entry_or_insert(scope: string) {
        // 若无此 scope 对应的 token, 则生成
        if(!this.#scopes.has(scope)) this.#scopes.set(scope, new AbortController())

        // 此时确保有 scope 对应的 token, 获取
        return this.#scopes.get(scope)!
    }

    /**
     * @description fetch 的所有类型请求的语法结构相同, 其请求体(如果有)在 `config` 中.
     */
    private common_fetch(request_type: RequestType, scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        // 获取 token
        const token_for_scope = this.entry_or_insert(scope)

        // 应用请求拦截器
        if(!!config) {
            this.#request_interceptors.forEach((interceptor) => {
                interceptor.fn(config)
            })
        }

        // 返回与此 token 绑定的请求实例
        return new Promise<Response>((resolve, reject) => {
            fetch(url, {
                ...(config ?? this.#global_config),
                method: request_type,
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
     * @description `GET`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    get(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('GET', scope, url, config)
    }

    /**
     * @description `GET`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    get_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'GET', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `POST`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    post(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('POST', scope, url, config)
    }

    /**
     * @description `POST`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    post_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'POST', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `DELETE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    delete(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('DELETE', scope, url, config)
    }

    /**
     * @description `DELETE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    delete_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'DELETE', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `PUT`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    put(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('PUT', scope, url, config)
    }

    /**
     * @description `PUT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    put_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'PUT', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `HEAD`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    head(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('HEAD', scope, url, config)
    }

    /**
     * @description `HEAD`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    head_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'HEAD', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `CONNECT`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    connect(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('CONNECT', scope, url, config)
    }

    /**
     * @description `CONNECT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    connect_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'CONNECT', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `OPTIONS`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    options(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('OPTIONS', scope, url, config)
    }

    /**
     * @description `OPTIONS`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    options_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'OPTIONS', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `TRACE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    trace(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('TRACE', scope, url, config)
    }

    /**
     * @description `TRACE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    trace_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'TRACE', scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `PATCH`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    patch(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return this.common_fetch('PATCH', scope, url, config)
    }

    /**
     * @description `PATCH`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    patch_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>) {
        return do_retry_task(
            retry,
            this.common_fetch,
            [ 'PATCH', scope, url, config ],
            this.isCancel
        )
    }
}

export {
    UseFetch
}