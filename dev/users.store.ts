import { createStore } from '@/index'
import { IUsersStore, Users } from './store'

const store = createStore<IUsersStore>({
  state: {
    users: null
  },
  mutations: {
    setUsers: (state, users) => {
      state.users = users
    },
    setUsersUrl: () => {}
  },
  actions: {
    async getUsers(context, users: Users) {
      context.commit('setUsers', users)
      return users
    }
  }
})

// eslint-disable-next-line no-console
console.log(store)
