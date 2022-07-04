# axios-canceller

[This library has been moved to better-xhr](https://www.npmjs.com/package/better-xhr)

cancel single or grouped request by axios

---
**Description**  
When using axios in frameworks such as vue and react.  
it is often encountered such a situation: the user leaves the page but some requests have not yet returned, and these
requests that are no longer needed consume network resources and may cause unpredictable consequences.  
This The library provides a class UseAxios to encapsulate and proxy the network request method of axios.  
You can set the scope to distinguish the scope or group of components that the network request takes effect.  
When we leave the view that initiated the request, we can call the cancelAll method to cancel the specified All requests
under scope.

**Usage**

```ts
import { UseAxios } from "axios-canceller";

const useaxios = new UseAxios()

// get
useaxios
    .get('scopename1', 'url', { /** config here */ })
    .then((res) => { /** ... */
    })
    .catch((err) => { /** ... */
    })

// post
useaxios
    .post('scopename2', 'url', 'data', { /** config here */ })
    .then((res) => { /** ... */
    })
    .catch((err) => { /** ... */
    })

// put
useaxios
    .put('scopename3', 'url', { /** config here */ })
    .then((res) => { /** ... */
    })
    .catch((err) => { /** ... */
    })

// delete
useaxios
    .delete('scopename4', 'url', { /** config here */ })
    .then((res) => { /** ... */
    })
    .catch((err) => { /** ... */
    })

// get scope list
useaxios.getScopes()

// cancel request
useaxios.cancelScopes('scopename1')  // single
useaxios.cancelScopes('scopename1', 'scopename2')  // multiple
```