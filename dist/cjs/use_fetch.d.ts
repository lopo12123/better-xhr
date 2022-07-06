export declare type RequestInterceptor = {
    fn: (config: Omit<RequestInit, 'signal' | 'method'>) => void;
};
export declare type ResponseInterceptor = {
    fulfill: (res: Response) => void;
    reject: (err: any) => void;
};
declare class UseFetch {
    #private;
    constructor(global_config?: Omit<RequestInit, 'signal' | 'method'>);
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
    cancel_scope(scope: string, message?: string): void;
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
    static isCancel: (err: any) => boolean;
    /**
     * @description 是否主动取消请求
     */
    isCancel: (err: any) => boolean;
    /**
     * @description 若存在该 scope 则直接返回, 否则插入并返回新值
     */
    private entry_or_insert;
    /**
     * @description fetch 的所有类型请求的语法结构相同, 其请求体(如果有)在 `config` 中.
     */
    private common_fetch;
    /**
     * @description `GET`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    get(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `GET`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    get_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `POST`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    post(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `POST`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    post_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `DELETE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    delete(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `DELETE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    delete_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `PUT`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    put(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `PUT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    put_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `HEAD`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    head(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `HEAD`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    head_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `CONNECT`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    connect(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `CONNECT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    connect_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `OPTIONS`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    options(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `OPTIONS`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    options_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `TRACE`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    trace(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `TRACE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    trace_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `PATCH`
     * @param scope `scope` 名
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    patch(scope: string, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
    /**
     * @description `PATCH`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求源
     * @param config 请求参数 (同 `fetch`, 但不允许配置 `method` 和 `signal`字段)
     */
    patch_retry(scope: string, retry: number, url: RequestInfo, config?: Omit<RequestInit, 'signal' | 'method'>): Promise<Response>;
}
export { UseFetch };
