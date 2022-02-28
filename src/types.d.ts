import { UnwrapNestedRefs } from 'vue'

enum Keys {
  state = 'state',
  mutations = 'mutations',
  actions = 'actions',
}

export interface IStoreOptions {
  state: { [key: string]: unknown }
  mutations?: { [key: string]: Function }
  actions?: { [key: string]: Function }
}

export interface IStore<S extends IStoreOptions> {
  state: UnwrapNestedRefs<S[Keys.state]>
  commit: <K extends keyof S[Keys.mutations]>(type: K, payload: any) => void
  dispatch: <K extends keyof S[Keys.actions]>(type: K, payload?: any) => any
}

export type Context = {
  dispatch: (type: string, payload?: any) => any
  commit: (type: string, payload: any) => void
  state: { [key: string]: unknown }
}
