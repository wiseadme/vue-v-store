// Vue API
import { reactive } from 'vue'
// Helpers
import { logError, isAsyncFunction, hasAsyncLogic } from './helpers'
// Subscribers
import { createSubscribers } from './util'
// Types
import { Store, StoreOptions, Keys } from './types'

export const createStore = <S extends StoreOptions>(options: S): Store<S> => {
  const state = reactive<S[Keys.state]>(options.state)
  const {
    actionSubs,
    mutationSubs,
    subscribeMutation,
    subscribeAction,
    notifySubscribers
  } = createSubscribers()

  const commit = <K extends keyof S[Keys.mutations]>(type: K & string, payload: any) => {
    const fn = options.mutations?.[type]

    if (!fn) {
      return logError(`ERROR[store]: unknown mutation type: ${ type }`)
    }

    if (isAsyncFunction(fn!)) {
      return logError('ERROR[store]: mutation can only be a synchronous function')
    }

    if (hasAsyncLogic(fn!)) {
      return logError(
        'ERROR[store]: asynchronous logic, including timers ' +
        'and promises, cannot be used in mutations'
      )
    }
    // notifying all subscribers before the mutation call
    try {
      notifySubscribers(type, mutationSubs)
    } catch (err) {
      logError('ERROR[store]: error in before mutation subscribers')
    }

    fn(state, payload)
    // notifying all subscribers after the mutation call
    try {
      notifySubscribers(type, mutationSubs, true)
    } catch (err) {
      logError('ERROR[store]: error in before mutation subscribers')
    }
  }

  const dispatch = async <K extends keyof S[Keys.actions]>(
    type: K & string,
    payload?: any
  ) => {
    const fn = options.actions?.[type]

    if (!fn) {
      return logError(`ERROR[store]: unknown action type: ${ type }`)
    }

    // notifying all subscribers before the action call
    try {
      notifySubscribers(type, actionSubs)
    } catch (err) {
      logError('ERROR[store]: error in before action subscribers')
    }

    const result = await fn({ commit, dispatch, state }, payload)

    // notifying all subscribers after the action call
    try {
      notifySubscribers(type, actionSubs, true)
    } catch (err) {
      logError('ERROR[store]: error in after action subscribers')
    }

    return result
  }

  return {
    state,
    commit,
    dispatch,
    subscribeAction,
    subscribeMutation
  }
}
