import { UnwrapNestedRefs } from 'vue'

export interface IStoreOptions<S extends { [key: string]: any }> {
  state: S['state']
  mutations: S['mutations']
  actions: S['actions']
}

export interface IStore<S extends IStoreOptions<S>> {
  state: UnwrapNestedRefs<S['state']>
  commit: <K extends keyof S['mutations']>(type: K, payload: any) => void
  dispatch: <K extends keyof S['actions']>(type: K, payload?: any) => any
}

export type Context = {
  dispatch: (type: string, payload?: any) => any
  commit: (type: string, payload: any) => void
}
