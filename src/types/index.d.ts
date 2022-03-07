import { UnwrapNestedRefs } from 'vue'

export declare function createStore<S extends StoreOptions>(
  options: S
): Store<S>

export declare function logError(msg: string): void

export declare function logWarn(msg: string): void

export declare function isAsyncFunction(fn: Function): boolean

export declare function hasAsyncLogic(fn: Function): boolean

export enum Keys {
  state = 'state',
  mutations = 'mutations',
  actions = 'actions',
}

export type State = { [key: infer U & U]: any }
export type Mutations = {
  [key: infer U & U]: (state: State, payload: any) => void
}
export type Actions = {
  [key: infer U & U]: (context: Store, payload: any) => void
}
export type Subscribers = { [key: infer U]: SubscriberOptions }
export type SubscriberOptions = {
  before?: Function
  after?: Function
}

export type StoreOptions = {
  state: State
  mutations?: Mutations
  actions?: Actions
}

export type Store<S extends StoreOptions = {}> = {
  state: UnwrapNestedRefs<S[Keys.state]>
  commit: <K extends keyof S[Keys.mutations]>(type: K, payload: any) => void
  dispatch: <K extends keyof S[Keys.actions]>(type: K, payload?: any) => any
  subscribeMutation: <K extends keyof S[Keys.mutations]>(
    type: K,
    fn: Function | SubscriberOptions
  ) => void
  subscribeAction: <K extends keyof S[Keys.actions]>(
    type: K,
    fn: Function | SubscriberOptions
  ) => void
}
