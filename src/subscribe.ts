import { Subscribers, SubscriberOptions } from '@/types'

export const createSubscribers = () => {
  const mutationSubs: Subscribers = {}
  const actionSubs: Subscribers = {}

  const prepareSubscription = (subs, fn, type) => {
    if (!subs[type]) subs[type] = []

    if (typeof fn === 'function') {
      subs[type].push({ before: fn })
    } else {
      subs[type].push(fn)
    }
  }

  const subscribeMutation = (type, fn: Function | SubscriberOptions) => {
    prepareSubscription(mutationSubs, fn, type)
  }

  const subscribeAction = (type, fn) => {
    prepareSubscription(actionSubs, fn, type)
  }

  const notify = (type: string, subs: Subscribers, isAfter = false) => {
    const subsType = isAfter ? 'after' : 'before'

    subs[type]
      .slice()
      .filter(sub => sub[subsType])
      .forEach(sub => sub[subsType]!())
  }

  return {
    actionSubs,
    mutationSubs,
    subscribeMutation,
    subscribeAction,
    notify
  }
}
