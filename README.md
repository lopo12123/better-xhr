### better-xhr

Use scoped requests (via xhr/fetch/axios) to quickly cancel specific requests when needed

⚠ require `node >= v15` to support `AbortController` (in node)

---

> axios

- ⚠ require `axios` as peerDependency
- `GET`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .get(
        'scope-for-get',
        'get-url',
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
        'scope-for-get', 5,
        'get-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

- `POST`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .post(
        'scope-for-post',
        'post-url',
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
        'scope-for-post', 5,
        'post-url',
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

- `DELETE`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .delete(
        'scope-for-delete',
        'delete-url',
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
        'scope-for-delete', 5,
        'delete-url',
        {}  // optional config for axios
    )
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

- `PUT`

```ts
import { UseAxios } from "better-xhr";

const useAxios = new UseAxios();

// single request
useAxios
    .put(
        'scope-for-put',
        'put-url',
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
        'scope-for-put', 5,
        'put-url',
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

- `Scope` & `Cancel`

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

- `Interceptor`

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

> fetch

> xhr
