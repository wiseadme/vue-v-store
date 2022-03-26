// Vue API
import { reactive } from 'vue'
// Helpers
import { logError, isAsyncFunction, hasAsyncLogic } from './helpers'
// Subscribers
import { useSubscribers } from './subscribers'
// Types
import { Store, Keys, Options, Pattern } from './types'

export const createStore = <S extends Options<Pattern<S>>>(options: S): Store<S> => {
  const state = reactive<S[Keys.state]>(options.state)
  const {
    actionSubs,
    mutationSubs,
    genNotifier,
    subscribeAction,
    subscribeMutation
  } = useSubscribers<S>()

  const commit = <K extends keyof S[Keys.mutations]>(type: K, payload: any) => {
    const fn = options.mutations?.[type]

    const notify = genNotifier(type, mutationSubs)

    if (!fn) {
      return logError(`ERROR[vue-v-store]: unknown mutation type: ${ type }`)
    }

    if (isAsyncFunction(fn)) {
      return logError('ERROR[vue-v-store]: mutation can only be a synchronous function')
    }

    if (hasAsyncLogic(fn)) {
      return logError(
        'ERROR[vue-v-store]: asynchronous logic, including timers ' +
        'and promises, cannot be used in mutations'
      )
    }
    // notifying all subscribers before the mutation call
    try {
      notify('before')
    } catch (err) {
      logError('ERROR[vue-v-store]: error in before mutation subscribers')
    }

    fn(state, payload)
    // notifying all subscribers after the mutation call
    try {
      notify('after')
    } catch (err) {
      logError('ERROR[vue-v-store]: error in before mutation subscribers')
    }
  }

  const dispatch = async <K extends keyof S[Keys.actions]>(
    type: K,
    payload?: any
  ) => {
    const fn = options.actions?.[type]

    const notifyAsync = genNotifier(type, actionSubs, true)

    if (!fn) {
      return logError(`ERROR[vue-v-store]: unknown action type: ${ type }`)
    }

    // notifying all subscribers before the action call
    try {
      await notifyAsync('before')
    } catch (err) {
      logError('ERROR[vue-v-store]: error in before action subscribers')
      return Promise.reject(err)
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
      await notifyAsync('after')
    } catch (err) {
      logError('ERROR[vue-v-store]: error in after action subscribers')
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
