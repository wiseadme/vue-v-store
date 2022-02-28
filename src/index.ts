// Vue API
import { reactive } from 'vue'
// Helpers
import { logError, isAsyncFunction, hasAsyncLogic } from './helpers'
// Types
import { IStore, IStoreOptions } from './types'

// createSore can be called to create
// a store template based on the given
// options, which include initial state,
// mutations and actions
export const createStore = <S extends IStoreOptions<S>>(
  options: IStoreOptions<S>
): IStore<S> => {
  // create reactive state root
  const state = reactive<S['state'] & object>(options.state)
  // commit a mutation to the present state
  const commit = <K extends keyof S['mutations']>(type: K, payload: any) => {
    // get the mutation
    const fn = options.mutations?.[type as string]
    // if the mutation is an async function
    // output the error message to the console
    if (isAsyncFunction(fn)) {
      return logError(
        'ERROR[store]: mutation can only be a synchronous function'
      )
    }
    // if the mutation involves asynchronous logic
    // output the error message to the console
    if (hasAsyncLogic(fn)) {
      return logError(
        'ERROR[store]: asynchronous logic, including timers ' +
        'and promises, cannot be used in mutations'
      )
    }
    // if the mutation exist run the mutation
    if (fn) return fn(state, payload)
    // If the type doesn't exist in mutations
    // output the error message to the console
    logError('unknown mutation type')
  }
  // dispatch a action for synchronous or asynchronous tasks
  const dispatch = <K extends keyof S['actions']>(type: K, payload?: any) => {
    // get the action
    const fn = options.actions?.[type as string]
    // if action exists run the action
    if (fn) return fn({ commit, dispatch }, payload)
    // If the type doesn't exist in actions
    // output the warning message to the console
    logError('unknown action type')
  }

  return {
    state,
    commit,
    dispatch,
  }
}
