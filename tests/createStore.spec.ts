import { createStore } from '../src/index'
import 'regenerator-runtime/runtime'

describe('createStore', () => {
  const user = { name: 'Alex' }
  let store
  let storeOptions

  beforeEach(() => {
    storeOptions = {
      state: {
        user: null as any
      },
      mutations: {
        setUser: (state, user) => state.user = user
      },
      actions: {
        async fetchUser({ commit }) {
          const data = await new Promise(resolve => setTimeout(() => resolve(user), 1000))
          commit('setUser', data)
          return data
        },

        async callAnotherAction({ dispatch }) {
          const data = await dispatch('fetchUser')
          return data
        },

        mutateStateFromAction({ state }, user) {
          state.user = user
        }
      }
    }
    store = createStore(storeOptions)
  })

  it('should create store', () => {
    expect(store.state).toBeTruthy()
    expect(store.dispatch).toBeTruthy()
    expect(store.commit).toBeTruthy()
  })

  it('should test the "commit" executing inside the action', async () => {
    const stub = jest.fn()
    storeOptions.mutations.setUser = stub
    await store.dispatch('fetchUser')
    expect(stub).toHaveBeenCalled()
    expect(stub).toBeCalledWith(storeOptions.state, user)
  })

  it('should test "state" mutation', async () => {
    await store.dispatch('fetchUser')
    expect(store.state.user.name).toEqual(user.name)
  })

  it('should test the "dispatch" executing inside the action', async () => {
    const stub = jest.fn()
    storeOptions.actions.fetchUser = stub
    await store.dispatch('callAnotherAction')
    expect(stub).toHaveBeenCalled()
  })

  it('should change "state" of the store from the action without calling a mutation', () => {
    store.dispatch('mutateStateFromAction', user)
    expect(store.state.user.name).toEqual(user.name)
  })

  it('should log the error if mutation is an async function', async () => {
    const spyOnError = jest.spyOn(console, 'error')
    storeOptions.mutations.setUser = async () => true
    await store.commit('setUser')
    expect(spyOnError).toHaveBeenCalled()
  })

  it('should log the error if "setTimeout" called in mutation', () => {
    const spyOnError = jest.spyOn(console, 'error')
    storeOptions.mutations.setUser = () => setTimeout(() => true)
    store.commit('setUser')
    expect(spyOnError).toHaveBeenCalled()
  })
})
