import e from"axios";import{do_retry_task as t}from"./core.js";class s{#e;constructor(e={}){this.#e=e}#t=new Map;get request_interceptors(){return[...this.#t.keys()]}#s=new Map;get response_interceptors(){return[...this.#s.keys()]}add_request_interceptor(e,t){this.#t.set(e,t)}remove_request_interceptor(e){this.#t.delete(e)}clear_request_interceptor(){this.#t.clear()}set_response_interceptor(e,t){this.#s.set(e,t)}remove_response_interceptor(e){this.#s.delete(e)}clear_response_interceptor(){this.#s.clear()}#r=new Map;get scopes(){return[...this.#r.keys()]}cancel_scope(e,t=""){this.#r.get(e)?.cancel(t),this.#r.delete(e)}cancel_scopes(...e){e.forEach((e=>{this.cancel_scope(e)}))}cancel_all(){this.#r.forEach((e=>{e.cancel()})),this.#r.clear()}static isCancel=e.isCancel;isCancel=e.isCancel;entry_or_insert(t){return this.#r.has(t)||this.#r.set(t,e.CancelToken.source()),this.#r.get(t)}get(t,s,r){const o=this.entry_or_insert(t);return r&&this.#t.forEach((e=>{e.fn(r)})),new Promise(((t,n)=>{e.get(s,{...r??this.#e,cancelToken:o.token}).then((e=>{this.#s.forEach((t=>{t.fulfill(e)})),t(e)})).catch((e=>{this.#s.forEach((t=>{t.reject(e)})),n(e)}))}))}get_retry(e,s=1,r,o){return t(s,this.get,[e,r,o],this.isCancel)}post(t,s,r,o){const n=this.entry_or_insert(t);return o&&this.#t.forEach((e=>{e.fn(o)})),new Promise(((t,c)=>{e.post(s,r,{...o??this.#e,cancelToken:n.token}).then((e=>{this.#s.forEach((t=>{t.fulfill(e)})),t(e)})).catch((e=>{this.#s.forEach((t=>{t.reject(e)})),c(e)}))}))}post_retry(e,s,r,o,n){return t(s,this.post,[e,r,o,n],this.isCancel)}delete(t,s,r){const o=this.entry_or_insert(t);return r&&this.#t.forEach((e=>{e.fn(r)})),new Promise(((t,n)=>{e.delete(s,{...r??this.#e,cancelToken:o.token}).then((e=>{this.#s.forEach((t=>{t.fulfill(e)})),t(e)})).catch((e=>{this.#s.forEach((t=>{t.reject(e)})),n(e)}))}))}delete_retry(e,s,r,o){return t(s,this.delete,[e,r,o],this.isCancel)}put(t,s,r,o){const n=this.entry_or_insert(t);return o&&this.#t.forEach((e=>{e.fn(o)})),new Promise(((t,c)=>{e.put(s,r,{...o??this.#e,cancelToken:n.token}).then((e=>{this.#s.forEach((t=>{t.fulfill(e)})),t(e)})).catch((e=>{this.#s.forEach((t=>{t.reject(e)})),c(e)}))}))}put_retry(e,s,r,o,n){return t(s,this.put,[e,r,o,n],this.isCancel)}}export{s as UseAxios};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlX2F4aW9zLmpzIiwic291cmNlcyI6WyIuLi9saWIvdXNlX2F4aW9zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbF0sIm5hbWVzIjpbIlVzZUF4aW9zIiwiZ2xvYmFsX2NvbmZpZyIsImNvbnN0cnVjdG9yIiwidGhpcyIsInJlcXVlc3RfaW50ZXJjZXB0b3JzIiwiTWFwIiwia2V5cyIsInJlc3BvbnNlX2ludGVyY2VwdG9ycyIsImFkZF9yZXF1ZXN0X2ludGVyY2VwdG9yIiwibmFtZSIsImludGVyY2VwdG9yIiwic2V0IiwicmVtb3ZlX3JlcXVlc3RfaW50ZXJjZXB0b3IiLCJkZWxldGUiLCJjbGVhcl9yZXF1ZXN0X2ludGVyY2VwdG9yIiwiY2xlYXIiLCJzZXRfcmVzcG9uc2VfaW50ZXJjZXB0b3IiLCJyZW1vdmVfcmVzcG9uc2VfaW50ZXJjZXB0b3IiLCJjbGVhcl9yZXNwb25zZV9pbnRlcmNlcHRvciIsInNjb3BlcyIsImNhbmNlbF9zY29wZSIsInNjb3BlIiwibWVzc2FnZSIsImdldCIsImNhbmNlbCIsImNhbmNlbF9zY29wZXMiLCJmb3JFYWNoIiwiY2FuY2VsX2FsbCIsImNhbmNlbGxlciIsInN0YXRpYyIsImF4aW9zIiwiaXNDYW5jZWwiLCJlbnRyeV9vcl9pbnNlcnQiLCJoYXMiLCJDYW5jZWxUb2tlbiIsInNvdXJjZSIsInVybCIsImNvbmZpZyIsInRva2VuX2Zvcl9zY29wZSIsImZuIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjYW5jZWxUb2tlbiIsInRva2VuIiwidGhlbiIsInJlcyIsImZ1bGZpbGwiLCJjYXRjaCIsImVyciIsImdldF9yZXRyeSIsInJldHJ5IiwiZG9fcmV0cnlfdGFzayIsInBvc3QiLCJkYXRhIiwicG9zdF9yZXRyeSIsImRlbGV0ZV9yZXRyeSIsInB1dCIsInB1dF9yZXRyeSJdLCJtYXBwaW5ncyI6IitEQVdBLE1BQU1BLEVBSU9DLEdBRVRDLFlBQVlELEVBQXlELElBQ2pFRSxNQUFLRixFQUFpQkEsRUFN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
