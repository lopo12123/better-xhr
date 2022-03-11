"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseAxios = void 0;
const axios_1 = __importDefault(require("axios"));
class UseAxios {
    constructor() {
        this._ScopeTokenPair = [];
        this.isCancel = axios_1.default.isCancel;
        this.interceptors = axios_1.default.interceptors;
    }
    // endregion
    /**
     * @description scope name is used to distinguish different groups
     */
    delete(scope, url, config = {}) {
        // search the cancelToken for the scope
        const pair = this._ScopeTokenPair.find((item) => {
            return item.scope === scope;
        });
        // first time for this scope
        if (!pair) {
            const cancelToken = axios_1.default.CancelToken.source();
            this._ScopeTokenPair.push({ scope, cancelToken });
            return axios_1.default.delete(url, Object.assign(Object.assign({}, config), { cancelToken: cancelToken.token }));
        }
        // already exist this scope
        else {
            return axios_1.default.delete(url, Object.assign(Object.assign({}, config), { cancelToken: pair.cancelToken.token }));
        }
    }
    /**
     * @description scope name is used to distinguish different groups
     */
    get(scope, url, config = {}) {
        // search the cancelToken for the scope
        const pair = this._ScopeTokenPair.find((item) => {
            return item.scope === scope;
        });
        // first time for this scope
        if (!pair) {
            const cancelToken = axios_1.default.CancelToken.source();
            this._ScopeTokenPair.push({ scope, cancelToken });
            return axios_1.default.get(url, Object.assign(Object.assign({}, config), { cancelToken: cancelToken.token }));
        }
        // already exist this scope
        else {
            return axios_1.default.get(url, Object.assign(Object.assign({}, config), { cancelToken: pair.cancelToken.token }));
        }
    }
    /**
     * @description scope name is used to distinguish different groups
     */
    post(scope, url, data, config = {}) {
        // search the cancelToken for the scope
        const pair = this._ScopeTokenPair.find((item) => {
            return item.scope === scope;
        });
        // first time for this scope
        if (!pair) {
            const cancelToken = axios_1.default.CancelToken.source();
            this._ScopeTokenPair.push({ scope, cancelToken });
            return axios_1.default.post(url, data, Object.assign(Object.assign({}, config), { cancelToken: cancelToken.token }));
        }
        // already exist this scope
        else {
            return axios_1.default.post(url, data, Object.assign(Object.assign({}, config), { cancelToken: pair.cancelToken.token }));
        }
    }
    /**
     * @description scope name is used to distinguish different groups
     */
    put(scope, url, data, config = {}) {
        // search the cancelToken for the scope
        const pair = this._ScopeTokenPair.find((item) => {
            return item.scope === scope;
        });
        // first time for this scope
        if (!pair) {
            const cancelToken = axios_1.default.CancelToken.source();
            this._ScopeTokenPair.push({ scope, cancelToken });
            return axios_1.default.put(url, data, Object.assign(Object.assign({}, config), { cancelToken: cancelToken.token }));
        }
        // already exist this scope
        else {
            return axios_1.default.put(url, data, Object.assign(Object.assign({}, config), { cancelToken: pair.cancelToken.token }));
        }
    }
    /**
     * @description return all the scope name in the store
     */
    getScopes() {
        return this._ScopeTokenPair.map((pair) => {
            return pair.scope;
        });
    }
    /**
     * @description cancel all the request in the scope
     */
    cancelScopes(...scopes) {
        scopes.forEach((scopeName) => {
            const pairIndex = this._ScopeTokenPair.findIndex((pair) => {
                return pair.scope === scopeName;
            });
            if (pairIndex !== -1) {
                // cancel all the request in this scope
                this._ScopeTokenPair[pairIndex].cancelToken.cancel();
                // remove this pair
                this._ScopeTokenPair.splice(pairIndex, 1);
            }
        });
    }
}
exports.UseAxios = UseAxios;
// region re-export
UseAxios.isCancel = axios_1.default.isCancel;
UseAxios.interceptors = axios_1.default.interceptors;
