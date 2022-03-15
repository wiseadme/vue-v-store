import {
  MutationSubscribers,
  ActionSubscribers,
  Subscribers,
  SubscriberOptions,
  Keys,
  StoreOptions
} from './types'

export const useSubscribers = <S extends StoreOptions<S>>() => {
  const mutationSubs = {} as MutationSubscribers<S>
  const actionSubs = {} as ActionSubscribers<S>

  const addSubscriber = (
    subs: Subscribers<S>,
    fn: Function | SubscriberOptions,
    type: string | number | symbol
  ) => {
    if (!subs[type]) subs[type] = []

    const sub = typeof fn === 'function' ? { before: fn } : fn
    subs[type].push(sub)

    return sub
  }

  const subscribeMutation = <K extends keyof S[Keys.mutations]>(
    type: K,
    fn: Function | SubscriberOptions
  ) => {
    const subscriber = addSubscriber(mutationSubs, fn, type)

    return () => {
      mutationSubs[type] = mutationSubs[type].filter(
        (sub) => sub !== subscriber
      )
    }
  }

  const subscribeAction = <K extends keyof S[Keys.actions]>(
    type: K,
    fn: Function | SubscriberOptions
  ) => {
    const subscriber = addSubscriber(actionSubs, fn, type)

    return () => {
      actionSubs[type] = actionSubs[type].filter(
        (sub) => sub !== subscriber
      )
    }
  }

  const notifySubscribers = (type: string, subs: Subscribers<S>, isAfter = false) => {
    const subsType = isAfter ? 'after' : 'before'

    subs[type]
      ?.slice()
      .filter((sub) => sub[subsType])
      .forEach((sub) => sub[subsType]?.())
  }

  return {
    actionSubs,
    mutationSubs,
    subscribeMutation,
    subscribeAction,
    notifySubscribers
  }
}
