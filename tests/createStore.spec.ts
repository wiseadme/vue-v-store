import { createStore } from '../src/index'
import 'regenerator-runtime/runtime'

describe('createStore', () => {
  const user = { name: 'Alex' }
  let store
  let storeOptions
  let steps: number[] = []

  beforeEach(() => {
    steps = []
    storeOptions = {
      state: {
        user: null as any,
        sub: false
      },
      mutations: {
        setUser: (state, user) => {
          state.user = user
        },
        setSub: (state, payload) => state.sub = payload
      },
      actions: {
        async fetchUser({ commit }){
          const data = await new Promise(resolve => setTimeout(() => resolve(user), 1000))
          commit('setUser', data)
          return data
        },

        async callAnotherAction({ dispatch }){
          return await dispatch('fetchUser')
        },

        mutateStateFromAction({ state }, user){
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

  it('should test execution of the "commit" inside the action', async () => {
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

  it('should test execution of the "dispatch" inside the action', async () => {
    const stub = jest.fn()
    storeOptions.actions.fetchUser = stub
    await store.dispatch('callAnotherAction')
    expect(stub).toHaveBeenCalled()
  })

  it('should change "state" of the store from the action without calling a mutation', () => {
    store.dispatch('mutateStateFromAction', user)
    expect(store.state.user.name).toEqual(user.name)
  })

  it('should out the error if mutation is an async function', async () => {
    const spyOnError = jest.spyOn(console, 'error')
    storeOptions.mutations.setUser = async () => true
    await store.commit('setUser')
    expect(spyOnError).toHaveBeenCalled()
  })

  it('should out the error if "setTimeout" called in mutation', () => {
    const spyOnError = jest.spyOn(console, 'error')
    storeOptions.mutations.setUser = () => setTimeout(() => true)
    store.commit('setUser')
    expect(spyOnError).toHaveBeenCalled()
  })

  it('should out the error message if mutation type does not exist', () => {
    const spy = jest.spyOn(console, 'error')
    store.commit('notExist')

    expect(spy).toBeCalledWith('ERROR[store]: unknown mutation type: notExist')
  })

  it('should out the error message if action type does not exist', () => {
    const spy = jest.spyOn(console, 'error')
    store.dispatch('notExist')

    expect(spy).toBeCalledWith('ERROR[store]: unknown action type: notExist')
  })

  it('should subscribe to the mutation and be executed before the mutation', () => {
    const subscriber = () => steps.push(0)
    storeOptions.mutations.setUser = () => steps.push(1)
    store.subscribeMutation('setUser', subscriber)
    store.commit('setUser', user)

    expect(JSON.stringify(steps)).toEqual('[0,1]')
  })

  it('should subscribe to the mutation and be executed after the mutation', () => {
    const subscriber = () => steps.push(0)
    storeOptions.mutations.setUser = () => steps.push(1)
    store.subscribeMutation('setUser', { after: subscriber })
    store.commit('setUser', user)

    expect(JSON.stringify(steps)).toEqual('[1,0]')
  })

  it('should subscribe to the action and be executed before the action', () => {
    const subscriber = () => steps.push(0)
    storeOptions.actions.test = () => steps.push(1)
    store.subscribeAction('test', { before: subscriber })
    store.dispatch('test')

    expect(JSON.stringify(steps)).toEqual('[0,1]')
  })

  it('should subscribe to the action and be executed after the action', async () => {
    const subscriber = () => steps.push(0)

    storeOptions.actions.test = () => new Promise(resolve => {
      setTimeout(() => {
        steps.push(1)
        resolve(true)
      }, 1000)
    })

    store.subscribeAction('test', { after: subscriber })

    await store.dispatch('test')

    expect(JSON.stringify(steps)).toEqual('[1,0]')
  })

  it('should unsubscribe from the mutation', () => {
    const subscriber = () => steps.push(1)
    const unsubscribe  = store.subscribeMutation('setUser', subscriber)

    store.commit('setUser')
    expect(JSON.stringify(steps)).toEqual("[1]")

    unsubscribe()
    store.commit('setUser')
    expect(JSON.stringify(steps)).toEqual("[1]")
  })

  it('should unsubscribe from the action', async () => {
    const subscriber = () => steps.push(1)
    const unsubscribe  = store.subscribeAction('fetchUser', subscriber)

    await store.dispatch('fetchUser')
    expect(JSON.stringify(steps)).toEqual("[1]")

    unsubscribe()
    store.dispatch('fetchUser')
    expect(JSON.stringify(steps)).toEqual("[1]")
  })
})
