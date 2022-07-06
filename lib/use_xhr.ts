import { do_retry_task, RequestType } from "./core";

export type XHRRequestConfig = {
    /**
     * @description The HTTP request method to use.
     */
    method: RequestType
    /**
     * @description A DOMString representing the URL to send the request to.
     */
    url?: string | URL
    /**
     * @description An optional Boolean parameter, defaulting to true , indicating whether or not to perform the operation asynchronously.
     */
    async?: boolean
    /**
     * @description A DOMString specifying the MIME type to use instead of the one specified by the server. If the server doesn't specify a type, XMLHttpRequest assumes "text/xml".
     */
    mimeType?: string
    /**
     * @description A body of data to be sent in the XHR request. If no value is specified for the body, a default value of null is used.
     */
    body?: Document | XMLHttpRequestBodyInit | null
    /**
     * @description Sets the value of HTTP request headers.
     */
    headers?: { [k: string]: string, [Symbol.iterator]: any }
    /**
     * @description If an empty string is set as the value of responseType, the default value of text is used.
     */
    responseType?: XMLHttpRequestResponseType
    /**
     * @description An unsigned long representing the number of milliseconds a request can take before automatically being terminated. The default value is 0, which means there is no timeout.
     */
    timeout?: number
    /**
     * @description A boolean value that indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.
     */
    withCredentials?: boolean
    /**
     * @description The function called when an XMLHttpRequest transaction is aborted.
     */
    onabort?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null
    /**
     * @description The function called when an XMLHttpRequest transaction fails due to an error.
     */
    onerror?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null
    /**
     * @description The function called when an XMLHttpRequest transaction completes successfully.
     */
    onload?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null
    /**
     * @description The function called when an XMLHttpRequest transaction starts transferring data.
     */
    onloadstart?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null
    /**
     * @description The function called when an XMLHttpRequest transaction finished transferring data.
     */
    onloadend?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null
    /**
     * @description The function called periodically with information when an XMLHttpRequest before success completely.
     */
    onprogress?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null
    /**
     * @description An event handler that is called whenever the readyState attribute changes.
     */
    onreadystatechange?: ((this: XMLHttpRequest, ev: Event) => any) | null
    /**
     * @description The function called when an XMLHttpRequest transaction fails due to timeout.
     */
    ontimeout?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null
}

export type XHRResponse = {
    /**
     * @description client's state.
     */
    readonly readyState: number
    /**
     * @description The response body.
     */
    readonly response: any
    /**
     * @description response as text. null if the request failed or "" if the request has not yet been sent by calling send()
     */
    readonly responseText: string
    /**
     * @description The read-only responseURL property returns the serialized URL of the response or the empty string if the URL is null. If the URL is returned, any URL fragment present in the URL will be stripped away. The value of responseURL will be the final URL obtained after any redirects.
     */
    readonly responseURL: string
    /**
     * @description The responseXML read-only property returns a Document containing the HTML or XML retrieved by the request or null if the request was unsuccessful, has not yet been sent, or if the data can't be parsed as XML or HTML.
     */
    readonly responseXML: Document | null
    /**
     * @description The read-only status property returns the numerical HTTP status code of the XMLHttpRequest's response.
     */
    readonly status: number
    readonly statusText: string
    readonly DONE: number;
    readonly HEADERS_RECEIVED: number;
    readonly LOADING: number;
    readonly OPENED: number;
    readonly UNSENT: number;
    /**
     * @description The method getAllResponseHeaders() returns all the response headers, separated by CRLF , as a string, or returns null if no response has been received. If a network error happened, an empty string is returned.
     */
    getAllResponseHeaders(): string
    /**
     * @description The method getResponseHeader() returns the string containing the text of a particular header's value. If there are multiple response headers with the same name, then their values are returned as a single concatenated string, where each value is separated from the previous one by a pair of comma and space. The getResponseHeader() method returns the value as a UTF byte sequence.
     */
    getResponseHeader(name: string): string | null
}

export type RequestInterceptor = {
    fn: (config: Omit<XHRRequestConfig, 'method' | 'url'>) => void
}
export type ResponseInterceptor = {
    fulfill: (res: XHRResponse) => void
    reject: (err: ProgressEvent) => void
}

class UseXhr {
    /**
     * @description 全局配置
     */
    #global_config: Omit<XHRRequestConfig, 'method' | 'url'>

    constructor(global_config: Omit<XHRRequestConfig, 'method' | 'url'> = {}) {
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
     * @description 某 scope 下的所有 abort 方法
     */
    readonly #scopes = new Map<string, Set<() => void>>()
    /**
     * @description 获取当前实例中的所有 scope
     */
    get scopes() {
        return [ ...this.#scopes.keys() ]
    }

    /**
     * @description 取消某个 scope 的请求
     */
    cancel_scope(scope: string) {
        this.#scopes.get(scope)?.forEach(abort => abort())
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
        this.#scopes.forEach(aborts => {
            aborts.forEach(abort => abort())
        })
        this.#scopes.clear()
    }

    /**
     * @description 是否主动取消请求
     */
    static isCancel = (ev: ProgressEvent & { isCancel?: boolean }) => {
        return !!ev.isCancel
    }
    /**
     * @description 是否主动取消请求
     */
    public isCancel = (ev: ProgressEvent & { isCancel?: boolean }) => {
        return !!ev.isCancel
    }

    /**
     * @description 若存在该 scope 则直接插入, 否则创建并插入
     */
    private insert_or_create(scope: string, abort: () => void) {
        const aborts = this.#scopes.get(scope)

        if(!aborts) this.#scopes.set(scope, new Set([ abort ]))
        else aborts.add(abort)
    }

    /**
     * @description xhr 的所有类型请求的语法结构相同, 其请求体(如果有)在 `config` 中.
     */
    private common_xhr(request_type: RequestType, scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return new Promise<XHRResponse>((resolve, reject) => {
            // init
            const xhr = new XMLHttpRequest()

            // 应用请求拦截器
            this.#request_interceptors.forEach((interceptor) => {
                interceptor.fn(config)
            })

            // 存储请求取消凭证
            this.insert_or_create(scope, () => {
                xhr?.abort?.()
            })

            // open
            xhr.open(request_type, url, config.async ?? true)
            if(!!config.mimeType) xhr.overrideMimeType(config.mimeType)
            if(!!config.headers) for (let name in config.headers) {
                xhr.setRequestHeader(name, config.headers[name])
            }
            xhr.responseType = config.responseType ?? ""
            xhr.timeout = config.timeout ?? 0
            xhr.withCredentials = config.withCredentials ?? false
            xhr.onabort = (ev) => {
                config.onabort?.call(xhr, ev)

                // 应用响应拦截器 - 失败
                this.#response_interceptors.forEach(interceptor => {
                    interceptor.reject(ev)
                })

                Object.defineProperties(ev, {
                    isCancel: {
                        value: true,
                        writable: false
                    }
                })

                reject(ev)
            }
            xhr.onerror = (ev) => {
                config.onerror?.call(xhr, ev)

                // 应用响应拦截器 - 失败
                this.#response_interceptors.forEach(interceptor => {
                    interceptor.reject(ev)
                })

                reject(ev)
            }
            xhr.onload = (ev) => {
                config.onload?.call(xhr, ev)

                const custom_response: XHRResponse = {
                    readyState: xhr.readyState,
                    response: xhr.response,
                    responseText: xhr.responseText,
                    responseURL: xhr.responseURL,
                    responseXML: xhr.responseXML,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    DONE: xhr.DONE,
                    HEADERS_RECEIVED: xhr.HEADERS_RECEIVED,
                    LOADING: xhr.LOADING,
                    OPENED: xhr.OPENED,
                    UNSENT: xhr.UNSENT,
                    getAllResponseHeaders: xhr.getAllResponseHeaders,
                    getResponseHeader: xhr.getResponseHeader
                }

                // 应用响应拦截器 - 成功
                this.#response_interceptors.forEach(interceptor => {
                    interceptor.fulfill(custom_response)
                })
                resolve(custom_response)
            }
            xhr.onloadstart = config.onloadstart ?? null
            xhr.onloadend = config.onloadend ?? null
            xhr.onprogress = config.onprogress ?? null
            xhr.onreadystatechange = config.onreadystatechange ?? null
            xhr.ontimeout = config.ontimeout ?? null

            // send
            xhr.send(config.body)
        })
    }

    /**
     * @description `GET`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    get(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('GET', scope, url, config)
    }

    /**
     * @description `GET`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    get_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
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
     * @param url 请求源
     * @param config
     */
    post(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('POST', scope, url, config)
    }

    /**
     * @description `POST`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    post_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return do_retry_task(
            retry,
            this.post,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `DELETE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    delete(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('DELETE', scope, url, config)
    }

    /**
     * @description `DELETE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    delete_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
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
     * @param url 请求源
     * @param config
     */
    put(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('PUT', scope, url, config)
    }

    /**
     * @description `PUT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    put_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return do_retry_task(
            retry,
            this.put,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `HEAD`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    head(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('HEAD', scope, url, config)
    }

    /**
     * @description `HEAD`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    head_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return do_retry_task(
            retry,
            this.head,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `CONNECT`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    connect(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('CONNECT', scope, url, config)
    }

    /**
     * @description `CONNECT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    connect_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return do_retry_task(
            retry,
            this.connect,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `OPTIONS`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    options(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('OPTIONS', scope, url, config)
    }

    /**
     * @description `OPTIONS`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    options_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return do_retry_task(
            retry,
            this.options,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `TRACE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    trace(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('TRACE', scope, url, config)
    }

    /**
     * @description `TRACE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    trace_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return do_retry_task(
            retry,
            this.trace,
            [ scope, url, config ],
            this.isCancel
        )
    }

    /**
     * @description `PATCH`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    patch(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return this.common_xhr('PATCH', scope, url, config)
    }

    /**
     * @description `PATCH`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    patch_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>) {
        return do_retry_task(
            retry,
            this.patch,
            [ scope, url, config ],
            this.isCancel
        )
    }
}

export {
    UseXhr
}