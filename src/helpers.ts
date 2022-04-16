export const logError = (msg: string | Error) => console.error(msg)

export const logWarn = (msg: string) => console.warn(msg)

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
