export const createSubscribers = () => {
  const subscribers = {}

  const subscribeMutation = ({ before, after }) => {
    // eslint-disable-next-line no-console
    console.log(before, after)
  }

  const subscribeAction = ({ before, after }) => {
    // eslint-disable-next-line no-console
    console.log(before, after)
  }

  return {
    subscribers,
    subscribeMutation,
    subscribeAction,
  }
}
