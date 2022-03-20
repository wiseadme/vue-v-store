// Vue API
import { reactive } from 'vue'
// Helpers
import { logError, isAsyncFunction, hasAsyncLogic } from './helpers'
// Subscribers
import { useSubscribers } from './subscribers'
// Types
import { Keys, Options, StoreOptions } from './types'

export const createStore = <S extends Options<StoreOptions<S>>>(options: S) => {
  const state = reactive<S[Keys.state]>(options.state)
  const {
    actionSubs,
    mutationSubs,
    notifySubscribers,
    subscribeAction,
    subscribeMutation
  } = useSubscribers<S>()

  const commit = <K extends keyof S[Keys.mutations]>(type: K, payload: any) => {
    const fn = options.mutations?.[type]

    if (!fn) {
      return logError(`ERROR[store]: unknown mutation type: ${ type }`)
    }

    if (isAsyncFunction(fn)) {
      return logError('ERROR[store]: mutation can only be a synchronous function')
    }

    if (hasAsyncLogic(fn)) {
      return logError(
        'ERROR[store]: asynchronous logic, including timers ' +
        'and promises, cannot be used in mutations'
      )
    }
    // notifying all subscribers before the mutation call
    try {
      notifySubscribers(type as string, mutationSubs)
    } catch (err) {
      logError('ERROR[store]: error in before mutation subscribers')
    }

    fn(state, payload)
    // notifying all subscribers after the mutation call
    try {
      notifySubscribers(type as string, mutationSubs, true)
    } catch (err) {
      logError('ERROR[store]: error in before mutation subscribers')
    }
  }

  const dispatch = async <K extends keyof S[Keys.actions]>(
    type: K,
    payload?: any
  ) => {
    const fn = options.actions?.[type]

    if (!fn) {
      return logError(`ERROR[store]: unknown action type: ${ type }`)
    }

    // notifying all subscribers before the action call
    try {
      notifySubscribers(type as string, actionSubs)
    } catch (err) {
      logError('ERROR[store]: error in before action subscribers')
    }

    const result = await fn({
      state,
      commit,
      dispatch,
      subscribeMutation,
      subscribeAction
    }, payload)

    // notifying all subscribers after the action call
    try {
      notifySubscribers(type as string, actionSubs, true)
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
