# v-store

#### Minimalistic and lightweight Vue 3 composition API-compatible store pattern plugin

* Simple API, only 1 function to create the store
* Small bundle footprint (< 2 kB unminified)

## Installing

```
npm install --save @v/store
```

## Quick start

To start using the plugin, simply import the ```createStore``` function and run it with the passed store parameters:

```typescript
import { createStore } from '@v/store'
import { IUsersStore, User } from '../types'
import { api } from '../api'

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
    async fetchUsers({ commit }) {
      const data = await api.fetchUsers()
      commit('setUsers', data)
      return data
    },

    async saveNewUser({ commit }, user) {
      const data = await api.saveUser(user)
      commit('addNewUser', data)
    }
  }
})

// export the store as a composition function
export const useUsersStore = () => store
```

After, you can use the store where you need it:

```vue

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
<script lang="ts">
  import { defineComponent } from 'vue'
  import { useUsersStore } from '../users/store'

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
```
If you don't want to use mutations, you can just use actions to change the state of the application. To do this, it's enough to simply extract the ```state``` from the context, which is the first argument of the action function:

```typescript
 const actions = {
  async fetchAndSetData({ dispatch, commit, state }, payload) {
    const data = await api.fetchData(payload)
    state.data = data
  }
 }
```
