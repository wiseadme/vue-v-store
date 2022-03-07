import { UnwrapNestedRefs } from 'vue'

export declare function createStore<S extends StoreOptions>(options: S): Store<S>

export declare function logError(msg: string): void

export declare function logWarn(msg: string): void

export declare function isAsyncFunction(fn: Function): boolean

export declare function hasAsyncLogic(fn: Function): boolean

export enum Keys {
  state = 'state',
  mutations = 'mutations',
  actions = 'actions',
}

export type State = { [key: string]: any }
export type Mutations = { [key: string]: (state: State, payload: any) => void }
export type Actions = { [key: string]: (context: Store, payload: any) => void }

export type Subscribers = { [key: string]: SubscriberOptions[] }

export type SubscriberOptions = {
  before?: Function
  after?: Function
}

export type StoreOptions = {
  state: State
  mutations?: Mutations
  actions?: Actions
}

export type Store<S extends StoreOptions> = {
  state: UnwrapNestedRefs<S[Keys.state]>
  commit: <K extends keyof S[Keys.mutations]>(type: K, payload: any) => void
  dispatch: <K extends keyof S[Keys.actions]>(type: K, payload?: any) => Promise<any>
  subscribeMutation: <K extends keyof S[Keys.mutations]>(
    type: K & string, fn: Function | SubscriberOptions
  ) => () => void
  subscribeAction: <K extends keyof S[Keys.actions]>(
    type: K & string, fn: Function | SubscriberOptions
  ) => () => void
}
