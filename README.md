## better-xhr

Use scoped requests (via xhr/fetch/axios) to quickly cancel specific requests when needed

### requirement

- `UseAxios`
    - `axios` as peerDependency
    - `node >= v15.0.0` to support `AbortController`
- `UseFetch`
    - `node >= v17.5.0` to support `fetch api`

---

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

---

### CHANGELOG

| version | description |
| --- | --- |
| `1.0.0` | Complete the encapsulation of `axios`. Support `GET`, `POST`, `DELETE`,`PUT` with `scope`, `retry`, `interceptor`. |