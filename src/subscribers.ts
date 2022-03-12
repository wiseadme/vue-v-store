import { Subscribers, SubscriberOptions } from './types'

export const useSubscribers = () => {
  const mutationSubs: Subscribers = {}
  const actionSubs: Subscribers = {}

  const addSubscriber = (
    subs: Subscribers,
    fn: Function | SubscriberOptions,
    type: string
  ) => {
    if (!subs[type]) subs[type] = []

    const sub = typeof fn === 'function' ? { before: fn } : fn
    subs[type].push(sub)

    return sub
  }

  const subscribeMutation = (type: string, fn: Function | SubscriberOptions) => {
    const subscriber = addSubscriber(mutationSubs, fn, type)

    return () => {
      mutationSubs[type] = mutationSubs[type].filter(
        (sub) => sub !== subscriber
      )
    }
  }

  const subscribeAction = (type: string, fn: Function | SubscriberOptions) => {
    const subscriber = addSubscriber(actionSubs, fn, type)

    return () => {
      actionSubs[type] = actionSubs[type].filter(
        (sub) => sub !== subscriber
      )
    }
  }

  const notifySubscribers = (type: string, subs: Subscribers, isAfter = false) => {
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