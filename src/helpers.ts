export const logError = (msg: string) => {
  // eslint-disable-next-line no-console
  console.error(msg)
}

export const logWarn = (msg: string) => {
  // eslint-disable-next-line no-console
  console.warn(msg)
}

export const isAsyncFunction = (fn: Function): boolean => {
  const stringFn = fn.toString().trim()

  return !!stringFn.match(/^async |return _async/g)
}

export const hasAsyncLogic = (fn: Function): boolean => {
  const stringFn = fn.toString().trim()

  return (
    !!stringFn.match(/return new Promise|Promise\./g) ||
    !!stringFn.match(/setTimeout|setInterval/g)
  )
}
