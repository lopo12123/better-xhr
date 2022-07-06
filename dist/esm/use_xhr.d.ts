import { RequestType } from "./core";
export declare type XHRRequestConfig = {
    /**
     * @description The HTTP request method to use.
     */
    method: RequestType;
    /**
     * @description A DOMString representing the URL to send the request to.
     */
    url?: string | URL;
    /**
     * @description An optional Boolean parameter, defaulting to true , indicating whether or not to perform the operation asynchronously.
     */
    async?: boolean;
    /**
     * @description A DOMString specifying the MIME type to use instead of the one specified by the server. If the server doesn't specify a type, XMLHttpRequest assumes "text/xml".
     */
    mimeType?: string;
    /**
     * @description A body of data to be sent in the XHR request. If no value is specified for the body, a default value of null is used.
     */
    body?: Document | XMLHttpRequestBodyInit | null;
    /**
     * @description Sets the value of HTTP request headers.
     */
    headers?: {
        [k: string]: string;
        [Symbol.iterator]: any;
    };
    /**
     * @description If an empty string is set as the value of responseType, the default value of text is used.
     */
    responseType?: XMLHttpRequestResponseType;
    /**
     * @description An unsigned long representing the number of milliseconds a request can take before automatically being terminated. The default value is 0, which means there is no timeout.
     */
    timeout?: number;
    /**
     * @description A boolean value that indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.
     */
    withCredentials?: boolean;
    /**
     * @description The function called when an XMLHttpRequest transaction is aborted.
     */
    onabort?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * @description The function called when an XMLHttpRequest transaction fails due to an error.
     */
    onerror?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * @description The function called when an XMLHttpRequest transaction completes successfully.
     */
    onload?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * @description The function called when an XMLHttpRequest transaction starts transferring data.
     */
    onloadstart?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * @description The function called when an XMLHttpRequest transaction finished transferring data.
     */
    onloadend?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * @description The function called periodically with information when an XMLHttpRequest before success completely.
     */
    onprogress?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
    /**
     * @description An event handler that is called whenever the readyState attribute changes.
     */
    onreadystatechange?: ((this: XMLHttpRequest, ev: Event) => any) | null;
    /**
     * @description The function called when an XMLHttpRequest transaction fails due to timeout.
     */
    ontimeout?: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
};
export declare type XHRResponse = {
    /**
     * @description client's state.
     */
    readonly readyState: number;
    /**
     * @description The response body.
     */
    readonly response: any;
    /**
     * @description response as text. null if the request failed or "" if the request has not yet been sent by calling send()
     */
    readonly responseText: string;
    /**
     * @description The read-only responseURL property returns the serialized URL of the response or the empty string if the URL is null. If the URL is returned, any URL fragment present in the URL will be stripped away. The value of responseURL will be the final URL obtained after any redirects.
     */
    readonly responseURL: string;
    /**
     * @description The responseXML read-only property returns a Document containing the HTML or XML retrieved by the request or null if the request was unsuccessful, has not yet been sent, or if the data can't be parsed as XML or HTML.
     */
    readonly responseXML: Document | null;
    /**
     * @description The read-only status property returns the numerical HTTP status code of the XMLHttpRequest's response.
     */
    readonly status: number;
    readonly statusText: string;
    readonly DONE: number;
    readonly HEADERS_RECEIVED: number;
    readonly LOADING: number;
    readonly OPENED: number;
    readonly UNSENT: number;
    /**
     * @description The method getAllResponseHeaders() returns all the response headers, separated by CRLF , as a string, or returns null if no response has been received. If a network error happened, an empty string is returned.
     */
    getAllResponseHeaders(): string;
    /**
     * @description The method getResponseHeader() returns the string containing the text of a particular header's value. If there are multiple response headers with the same name, then their values are returned as a single concatenated string, where each value is separated from the previous one by a pair of comma and space. The getResponseHeader() method returns the value as a UTF byte sequence.
     */
    getResponseHeader(name: string): string | null;
};
export declare type RequestInterceptor = {
    fn: (config: Omit<XHRRequestConfig, 'method' | 'url'>) => void;
};
export declare type ResponseInterceptor = {
    fulfill: (res: XHRResponse) => void;
    reject: (err: ProgressEvent) => void;
};
declare class UseXhr {
    #private;
    constructor(global_config?: Omit<XHRRequestConfig, 'method' | 'url'>);
    /**
     * @description 获取当前实例中的所有请求拦截器名称
     */
    get request_interceptors(): string[];
    /**
     * @description 获取当前实例中的所有响应拦截器名称
     */
    get response_interceptors(): string[];
    /**
     * @description 添加请求拦截器
     * @param name 标识
     * @param interceptor 拦截器
     */
    add_request_interceptor(name: string, interceptor: RequestInterceptor): void;
    /**
     * @description 移除请求拦截器
     * @param name 拦截器名称
     */
    remove_request_interceptor(name: string): void;
    /**
     * @description 清空请求拦截器
     */
    clear_request_interceptor(): void;
    /**
     * @description 添加响应拦截器
     * @param name 标识
     * @param interceptor 拦截器
     */
    add_response_interceptor(name: string, interceptor: ResponseInterceptor): void;
    /**
     * @description 移除响应拦截器
     * @param name 拦截器名称
     */
    remove_response_interceptor(name: string): void;
    /**
     * @description 清空响应拦截器
     */
    clear_response_interceptor(): void;
    /**
     * @description 获取当前实例中的所有 scope
     */
    get scopes(): string[];
    /**
     * @description 取消某个 scope 的请求
     */
    cancel_scope(scope: string): void;
    /**
     * @description 取消某些 scope 的请求
     */
    cancel_scopes(...scopes: string[]): void;
    /**
     * @description 取消全部 scope 的请求
     */
    cancel_all(): void;
    /**
     * @description 是否主动取消请求
     */
    static isCancel: (ev: ProgressEvent & {
        isCancel?: boolean;
    }) => boolean;
    /**
     * @description 是否主动取消请求
     */
    isCancel: (ev: ProgressEvent & {
        isCancel?: boolean;
    }) => boolean;
    /**
     * @description 若存在该 scope 则直接插入, 否则创建并插入
     */
    private insert_or_create;
    /**
     * @description xhr 的所有类型请求的语法结构相同, 其请求体(如果有)在 `config` 中.
     */
    private common_xhr;
    /**
     * @description `GET`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    get(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `GET`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    get_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `POST`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    post(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `POST`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    post_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `DELETE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    delete(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `DELETE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    delete_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `PUT`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    put(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `PUT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    put_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `HEAD`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    head(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `HEAD`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    head_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `CONNECT`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    connect(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `CONNECT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    connect_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `OPTIONS`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    options(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `OPTIONS`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    options_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `TRACE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    trace(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `TRACE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    trace_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `PATCH`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config
     */
    patch(scope: string, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
    /**
     * @description `PATCH`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config
     */
    patch_retry(scope: string, retry: number, url: string | URL, config: Omit<XHRRequestConfig, 'method' | 'url'>): Promise<XHRResponse>;
}
export { UseXhr };
