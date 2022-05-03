// Vue API
import { reactive } from 'vue'

const storeHashMap = new Map()

export const createState = <S extends object>(id: string, stateFn: () => S) => {
  const state = reactive(stateFn())
  storeHashMap.set(`${ id }-state`, state)
  return state
}

export const createActions = (id: string, actions: any) => {
  const state = storeHashMap.get(`${ id }-state`)

  Object.keys(actions).forEach((fn) => {
    actions[fn] = actions[fn].bind(state)
  })

  storeHashMap.set(`${ id }-actions`, actions)

  return actions
}

export const defineStore = (id: string) => {
  const state = storeHashMap.get(`${ id }-state`)
  const actions = storeHashMap.get(`${ id }-actions`)

  return () => ({
    state,
    ...actions
  })
}
