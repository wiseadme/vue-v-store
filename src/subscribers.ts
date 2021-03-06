import {
  Keys,
  Pattern,
  Subscribers,
  MutationSubscribers,
  ActionSubscribers,
  SubscriberOptions,
  BeforeEffectOptions
} from './types'

export const useSubscribers = <S extends Pattern<S>>() => {
  const mutationSubs = {} as MutationSubscribers<S>
  const actionSubs = {} as ActionSubscribers<S>

  const addSubscriber = (
    subs: Subscribers<S>,
    fn: Function | SubscriberOptions,
    type: keyof Subscribers<S>,
  ): SubscriberOptions => {
    if (!subs[type]) subs[type] = []

    const sub = typeof fn === 'function' ? { before: fn } : fn
    subs[type].push(sub)

    return sub
  }

  const subscribeMutation = <K extends keyof S[Keys.mutations]>(
    type: K,
    fn: Function | SubscriberOptions
  ) => {
    const subscriber = addSubscriber(mutationSubs, fn, type as keyof Subscribers<S>)

    return () => {
      mutationSubs[type] = mutationSubs[type].filter(
        (sub) => sub !== subscriber
      )
    }
  }

  const subscribeAction = <K extends keyof S[Keys.actions]>(
    type: K,
    fn: Function | SubscriberOptions,
  ) => {
    const subscriber = addSubscriber(actionSubs, fn, type as keyof Subscribers<S>)

    return () => {
      actionSubs[type] = actionSubs[type].filter(
        (sub) => sub !== subscriber
      )
    }
  }

  const genNotifier = (
    type: string,
    subs: Subscribers<S>,
    isAsync = false
  ): Function => {
    if (isAsync) {
      return async (key): Promise<any> => {
        // 'before' or 'after' effects array
        const effects = subs[type]?.slice().filter((sub) => sub[key])
        // array of async function calls
        const promises = [] as Promise<any>[]

        if (effects && effects.length) {
          for (const sub of effects) {
            // if "wait" is equal true
            // then we add the call of its "before" effect
            // to the array of promises
            if (sub.before && (sub.before as BeforeEffectOptions).wait) {
              promises.push(sub[key].wait())
            } else {
              sub[key]()
            }
          }
        }

        try {
          await Promise.all(promises)
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }

    return (key) => {
      subs[type]?.slice().filter((sub) => sub[key]).forEach(sub => sub[key]())
    }
  }

  return {
    actionSubs,
    mutationSubs,
    subscribeMutation,
    subscribeAction,
    genNotifier
  }
}
