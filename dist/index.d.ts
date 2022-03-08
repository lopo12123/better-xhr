import { AxiosRequestConfig } from "axios";
declare class UseAxios {
    private _ScopeTokenPair;
    /**
     * @description scope name is used to distinguish different groups
     */
    delete(scope: string, url: string, config?: AxiosRequestConfig<any>): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * @description scope name is used to distinguish different groups
     */
    get(scope: string, url: string, config?: AxiosRequestConfig<any>): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * @description scope name is used to distinguish different groups
     */
    post(scope: string, url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * @description scope name is used to distinguish different groups
     */
    put(scope: string, url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * @description return all the scope name in the store
     */
    getScopes(): string[];
    /**
     * @description cancel all the request in the scope
     */
    cancelScopes(...scopes: string[]): void;
}
export { UseAxios };
