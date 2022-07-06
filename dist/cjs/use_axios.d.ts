import { AxiosRequestConfig } from "axios";
export declare type RequestInterceptor = {
    fn: (config: Omit<AxiosRequestConfig, 'signal'>) => void;
};
export declare type ResponseInterceptor = {
    fulfill: (res: any) => void;
    reject: (err: any) => void;
};
declare class UseAxios {
    #private;
    constructor(global_config?: Omit<AxiosRequestConfig, 'signal'>);
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
     * @description `GET`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    get(scope: string, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `GET`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    get_retry(scope: string, retry: number, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `POST`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    post(scope: string, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `POST`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    post_retry(scope: string, retry: number, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `DELETE`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    delete(scope: string, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `DELETE`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    delete_retry(scope: string, retry: number, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `PUT`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    put(scope: string, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `PUT`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    put_retry(scope: string, retry: number, url: string, data?: any, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `HEAD`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    head(scope: string, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `HEAD`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    head_retry(scope: string, retry: number, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `OPTIONS`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    options(scope: string, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `OPTIONS`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    options_retry(scope: string, retry: number, url: string, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `PATCH`
     * @param scope `scope` 名
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    patch(scope: string, url: string, data: any, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
    /**
     * @description `PATCH`, 失败后自动重试 `retry` 次, 主动取消请求则会无视重试直接抛出
     * @param scope `scope` 名
     * @param retry 自动重试次数(`>=1`, 若传入小于`1`则默认为`1`)
     * @param url 请求地址
     * @param data 请求体
     * @param config 请求参数 (同 `axios`, 但不允许配置 `signal` 字段)
     */
    patch_retry(scope: string, retry: number, url: string, data: any, config?: Omit<AxiosRequestConfig, 'signal'>): Promise<unknown>;
}
export { UseAxios };
