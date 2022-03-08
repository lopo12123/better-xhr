import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

interface ScopeTokenPair {
    scope: string
    cancelToken: CancelTokenSource
}

class UseAxios {
    #ScopeTokenPair: ScopeTokenPair[] = []

    /**
     * @description scope name is used to distinguish different groups
     */
    delete(scope: string, url: string, config: AxiosRequestConfig<any> = {}) {
        // search the cancelToken for the scope
        const pair = this.#ScopeTokenPair.find((item) => {
            return item.scope === scope
        })
        // first time for this scope
        if(!pair) {
            const cancelToken = axios.CancelToken.source()
            this.#ScopeTokenPair.push({ scope, cancelToken })
            return axios.delete(url, { ...config, cancelToken: cancelToken.token })
        }
        // already exist this scope
        else {
            return axios.delete(url, { ...config, cancelToken: pair.cancelToken.token })
        }
    }

    /**
     * @description scope name is used to distinguish different groups
     */
    get(scope: string, url: string, config: AxiosRequestConfig<any> = {}) {
        // search the cancelToken for the scope
        const pair = this.#ScopeTokenPair.find((item) => {
            return item.scope === scope
        })
        // first time for this scope
        if(!pair) {
            const cancelToken = axios.CancelToken.source()
            this.#ScopeTokenPair.push({ scope, cancelToken })
            return axios.get(url, { ...config, cancelToken: cancelToken.token })
        }
        // already exist this scope
        else {
            return axios.get(url, { ...config, cancelToken: pair.cancelToken.token })
        }
    }

    /**
     * @description scope name is used to distinguish different groups
     */
    post(scope: string, url: string, data?: any, config: AxiosRequestConfig<any> = {}) {
        // search the cancelToken for the scope
        const pair = this.#ScopeTokenPair.find((item) => {
            return item.scope === scope
        })
        // first time for this scope
        if(!pair) {
            const cancelToken = axios.CancelToken.source()
            this.#ScopeTokenPair.push({ scope, cancelToken })
            return axios.post(url, data, { ...config, cancelToken: cancelToken.token })
        }
        // already exist this scope
        else {
            return axios.post(url, data, { ...config, cancelToken: pair.cancelToken.token })
        }
    }

    /**
     * @description scope name is used to distinguish different groups
     */
    put(scope: string, url: string, data?: any, config: AxiosRequestConfig<any> = {}) {
        // search the cancelToken for the scope
        const pair = this.#ScopeTokenPair.find((item) => {
            return item.scope === scope
        })
        // first time for this scope
        if(!pair) {
            const cancelToken = axios.CancelToken.source()
            this.#ScopeTokenPair.push({ scope, cancelToken })
            return axios.put(url, data, { ...config, cancelToken: cancelToken.token })
        }
        // already exist this scope
        else {
            return axios.put(url, data, { ...config, cancelToken: pair.cancelToken.token })
        }
    }

    /**
     * @description return all the scope name in the store
     */
    getScopes(): string[] {
        return this.#ScopeTokenPair.map((pair) => {
            return pair.scope
        })
    }

    /**
     * @description cancel all the request in the scope
     */
    cancelScopes(...scopes: string[]) {
        scopes.forEach((scopeName) => {
            const pairIndex = this.#ScopeTokenPair.findIndex((pair) => {
                return pair.scope === scopeName
            })
            if(pairIndex !== -1) {
                // cancel all the request in this scope
                this.#ScopeTokenPair[pairIndex].cancelToken.cancel()
                // remove this pair
                this.#ScopeTokenPair.splice(pairIndex, 1)
            }
        })
    }
}

export {
    UseAxios
}