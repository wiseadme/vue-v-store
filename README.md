# vue-v-store

#### Minimalistic and lightweight Vue 3 composition API-compatible store pattern plugin

* Simple and minimalistic
* Lightweight and easily maintained
* Flexible and with excellent typescript support

## Installing

```
npm install --save vue-v-store
```

## Quick start

* To start using the plugin, simply import the ```createStore``` function and run it with the passed store parameters:

```typescript
import {createStore} from 'vue-v-store'
import {IUsersStore, User} from '../types'
import {api} from '../api'

const store = createStore<IUsersStore>({
    state: {
        users: null
    },
    mutations: {
        setUsers(state, users) {
            state.users = users
        },
        addNewUser(state, user) {
            state.users.push(user)
        }
    },
    actions: {
        async fetchUsers({commit}) {
            const data = await api.fetchUsers()
            commit('setUsers', data)
            return data
        },

        async saveNewUser({commit}, user) {
            const data = await api.saveUser(user)
            commit('addNewUser', data)
        }
    }
})

// export the store as a composition function
export const useUsersStore = () => store
```

* After, you can use the store where you need it:

```vue

<script lang="ts">
import {defineComponent} from 'vue'
import {useUsersStore} from '../users/store'

export default defineComponent({
  setup() {
    const $store = useUsersStore()

    const getUsers = () => {
      $store.dispatch('fetchUsers')
    }

    return {
      $store,
      getUsers
    }
  }
})
</script>
<template>
  <div class="page">
    <span v-if="$store.state.users">
      users count: {{ $store.state.users.length }}
    </span>
  </div>
  <button @click="getUsers">
    FETCH USERS
  </button>
  <button @click="$store.dispatch('saveNewUser', {name: 'Alex', age: 25})">
    SAVE USER
  </button>
</template>
```

* If you don't want to use mutations, you can just use actions to change the state of the application. To do this, it's
enough to simply extract the ```state``` from the context, which is the first argument of the action function:

```typescript
 const actions = {
    async fetchAndSetData({dispatch, commit, state}, payload) {
        const data = await api.fetchData(payload)
        state.data = data
    }
}
```

# Mutations

* In ```mutations```, you can only use synchronous functions without asynchronous logic. Such restrictions will allow you
to separate synchronous and asynchronous actions. Therefore, mutations cannot use ```async```, ```Promise```
, ```setTimeout```, and ```setInterval```. Using the above will result in an error.

#### All the examples below will lead to an error:

```typescript
const mutations = {
    async setUser(state, user) { // Error
        //... 
    },

    setAfterTimeout(state, data) {
        setTimeout(() => { // Error
            //...
        }, 100)
    }

    setWithPromise(state, value) {
        return new Promise(resolve => { // Error
            //...
        })
    }
}
```

# Actions

* On the contrary, actions allow you to use any asynchronous logic. Here you can wait for the response of the request to
the server or return the ```promise``` object as the result of the action.

```typescript
const actions = {
    async createUser(context, payload) {
        try {
            const data = await api.create('/user', payload)
            return data
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
```

# Types

* ```vue-v-store``` is implemented using ```typescript``` and therefore has full typing support:

```typescript
import {Store, StoreOptions} from 'vue-v-store'

type Maybe<T> = T | null

export type User = {
    url: string
    options: object
}

export interface IUsersStore extends StoreOptions {
    state: IUsersState
    mutations: IUsersMutations
    actions: IUsersActions
}

export interface IUsersState {
    user: Maybe<User>
}

export interface IUsersMutations {
    setUsers: (state: IUsersState, users: Users[]) => void
    setUsersUrl: (state: IUsersState, url: string) => void
}

export interface IUsersActions {
    getUsers: (context: Store<IUsersStore>) => Promise<User[]>
}
```

# About

* ```vue-v-store``` is a plugin that will allow you to create the store of your application wherever it is convenient for you.
You can create the store in ```vue``` components or in third-party ```js``` or ```ts``` files.

* ```vue-v-store``` is an open-source project, so if you want to participate in its development, it will be enough for you to make a copy of the repository using ```fork```, and then create a ```pull request``` and wait for confirmation of your changes.

##### Thanks for reading the documentation, and I hope you enjoy working with this plugin
