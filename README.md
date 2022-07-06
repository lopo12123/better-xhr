## better-xhr

The encapsulation of `fetch`/`XMLHttpRequest`/`axios` makes it possible to use scopes to identify requests, and to
cancel requests under a certain (several) scopes. Request/Response interceptors are also supported.

### requirement

- `UseAxios`
    - `axios` as peerDependency
    - `node >= v15.0.0` to support `AbortController`
- `UseFetch`
    - `node >= v17.5.0` to support `fetch api`

---

### retry

This is a general generic function used by other classes. When the promise fails, it will automatically repeat several
times and then throw the error. Expose here to enable retrying of custom behavior.

- declaration

```ts
declare const do_retry_task: <Params extends Array<any> = any[], Response = any>
(max: number,
 task: (...args: Params) => Promise<Response>,
 args: Params,
 immediate_condition?: ((err: any) => boolean) | undefined)
    => Promise<Response>;
```

- example

```ts
import { do_retry_task } from "better-xhr";

let count = 0
const countup_in_1s = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            count += 1
            console.log('now count is: ', count)
            reject('for auto retry')
        }, 1_000)
    })
}

do_retry_task(5, countup_in_1s, [])
    .then(res => {
        console.log('res: ', res)
    })
    .catch(err => {
        console.log('err: ', err)
    })
// now count is:  1 - origin request
// now count is:  2 - retry 1
// now count is:  3 - retry 2
// now count is:  4 - retry 3
// now count is:  5 - retry 4
// now count is:  6 - retry 5
// err: for auto retry - promise after auto-retry
```

### axios

- `axios` as peerDependency
- `node >= v15.0.0` to support `AbortController`

> `GET`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .get(
        'scope-name',
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useAxios
    .get_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `POST`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .post(
        'scope-name',
        'target-url',
        null,  // post data in any type
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useAxios
    .post(
        'scope-name', 5,
        'target-url',
        null,  // post data in any type
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `DELETE`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .delete(
        'scope-name',
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useAxios
    .delete_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `PUT`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .put(
        'scope-name',
        'target-url',
        null,  // put data in any type
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useAxios
    .put_retry(
        'scope-name', 5,
        'target-url',
        null,  // put data in any type
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `HEAD`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .head(
        'scope-name',
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useAxios
    .head_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `OPTIONS`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .options(
        'scope-name',
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useAxios
    .options_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `PATCH`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .patch(
        'scope-name',
        'target-url',
        null,  // put data in any type
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useAxios
    .patch_retry(
        'scope-name', 5,
        'target-url',
        null,  // put data in any type
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `Scope` & `Cancel`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// setup a request with scope
useAxios
    .get(
        'scope-name',
        'target-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        const if_manually_cancel = useAxios.isCancel(err)
        console.log(if_manually_cancel
            ? 'the request is cancelled by code!'
            : 'error occurred when request!')
    })

// get all scopes in the instance
const scopes = useAxios.scopes
console.log(scopes)  // [ 'scope-name' ]

// cancel specific scope
useAxios.cancel_scope('scope-name')

// cancel scopes
useAxios.cancel_scopes([ 'scope1', 'scope2', 'scope3' ])

// cancel all request
useAxios.cancel_all()
```

> `Interceptor`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// request interceptor

// - add 
useAxios
    .add_request_interceptor(
        'interceptor1',
        (config) => {
            /** operate config here */
        }
    )

// - list
console.log(useAxios.request_interceptors)  // [ 'interceptor1' ]

// - remove
useAxios.remove_request_interceptor('interceptor1')

// response interceptor

// - add
useAxios
    .add_response_interceptor(
        'interceptor2',
        {
            fulfill: (res) => {
                /** operate response */
            },
            reject: (err) => {
                /** operate error */
            }
        }
    )

// - list
console.log(useAxios.response_interceptors)  // [ 'interceptor2' ]

// - remove
useAxios.remove_response_interceptor('interceptor2')
```

---

### fetch

- `node >= v17.5.0` to support `fetch api`

> `GET`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .get(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .get_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `POST`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .post(
        'scope-name',
        'target-url',
        {
            body: null  // post data in any type
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .post_retry(
        'scope-name', 5,
        'target-url',
        {
            body: null  // post data in any type
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `DELETE`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .delete(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .delete_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `PUT`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .put(
        'scope-name',
        'target-url',
        {
            body: null  // put data in any type
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .put_retry(
        'scope-name', 5,
        'target-url',
        {
            body: null  // put data in any type
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `HEAD`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .head(
        'scope-name',
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .put_retry(
        'scope-name', 5,
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `CONNECT`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .connect(
        'scope-name',
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .connect_retry(
        'scope-name', 5,
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `OPTIONS`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .options(
        'scope-name',
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .options_retry(
        'scope-name', 5,
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `TRACE`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .trace(
        'scope-name',
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .trace_retry(
        'scope-name', 5,
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `PATCH`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// single request
useFetch
    .patch(
        'scope-name',
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useFetch
    .patch_retry(
        'scope-name', 5,
        'target-url',
        {
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `Scope` & `Cancel`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// setup a request with scope
useFetch
    .get(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// get all scopes in the instance
const scopes = useFetch.scopes
console.log(scopes)  // [ 'scope-name' ]

// cancel specific scope
useFetch.cancel_scope('scope-name')

// cancel scopes
useFetch.cancel_scopes([ 'scope1', 'scope2', 'scope3' ])

// cancel all request
useFetch.cancel_all()
```

> `Interceptor`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// request interceptor

// - add 
useFetch
    .add_request_interceptor(
        'interceptor1',
        (config) => {
            /** operate config here */
        }
    )

// - list
console.log(useFetch.request_interceptors)  // [ 'interceptor1' ]

// - remove
useFetch.remove_request_interceptor('interceptor1')

// response interceptor

// - add
useFetch
    .add_response_interceptor(
        'interceptor2',
        {
            fulfill: (res) => {
                /** operate response */
            },
            reject: (err) => {
                /** operate error */
            }
        }
    )

// - list
console.log(useFetch.response_interceptors)  // [ 'interceptor2' ]

// - remove
useFetch.remove_response_interceptor('interceptor2')
```

---

### xhr

> `GET`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .get(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .get_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `POST`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .post(
        'scope-name',
        'target-url',
        {
            body: null  // request body
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .post_retry(
        'scope-name', 5,
        'target-url',
        {
            body: null  // request body
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `DELETE`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .delete(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .delete_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `PUT`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .put(
        'scope-name',
        'target-url',
        {
            body: null  // request body
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .put_retry(
        'scope-name', 5,
        'target-url',
        {
            body: null  // request body
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `HEAD`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .head(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .head_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `CONNECT`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .connect(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .connect_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `OPTIONS`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .options(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .options_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `TRACE`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .trace(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .trace_retry(
        'scope-name', 5,
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `PATCH`

```ts
import { UseXhr } from "better-xhr";

const useXhr = new UseXhr();

// single request
useXhr
    .patch(
        'scope-name',
        'target-url',
        {
            body: null  // request body
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// auto retry
useXhr
    .patch_retry(
        'scope-name', 5,
        'target-url',
        {
            body: null  // request body
            // optional config for fetch
        }
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

> `Scope` & `Cancel`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// setup a request with scope
useFetch
    .get(
        'scope-name',
        'target-url',
        {}  // optional config for fetch
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

// get all scopes in the instance
const scopes = useFetch.scopes
console.log(scopes)  // [ 'scope-name' ]

// cancel specific scope
useFetch.cancel_scope('scope-name')

// cancel scopes
useFetch.cancel_scopes([ 'scope1', 'scope2', 'scope3' ])

// cancel all request
useFetch.cancel_all()
```

> `Interceptor`

```ts
import { UseFetch } from "better-xhr";

const useFetch = new UseFetch();

// request interceptor

// - add 
useFetch
    .add_request_interceptor(
        'interceptor1',
        (config) => {
            /** operate config here */
        }
    )

// - list
console.log(useFetch.request_interceptors)  // [ 'interceptor1' ]

// - remove
useFetch.remove_request_interceptor('interceptor1')

// response interceptor

// - add
useFetch
    .add_response_interceptor(
        'interceptor2',
        {
            fulfill: (res) => {
                /** operate response */
            },
            reject: (err) => {
                /** operate error */
            }
        }
    )

// - list
console.log(useFetch.response_interceptors)  // [ 'interceptor2' ]

// - remove
useFetch.remove_response_interceptor('interceptor2')
```
