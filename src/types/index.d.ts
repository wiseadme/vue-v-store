import { UnwrapNestedRefs } from 'vue'

export declare function createStore<S extends StoreOptions<S>>(options: S): Store<S>

export declare function logError(msg: string): void

export declare function logWarn(msg: string): void

export declare function isAsyncFunction(fn: Function): boolean

export declare function hasAsyncLogic(fn: Function): boolean

export enum Keys {
  state = 'state',
  mutations = 'mutations',
  actions = 'actions',
}

export type State<S extends StoreOptions<S>> = {
  [key in keyof S[Keys.state]]: S[Keys.state][key]
}
export type Mutations<S extends StoreOptions<S>> = {
  [key in keyof S[Keys.mutations]]: (state: State<S>, payload: any) => void
}
export type Actions<S extends StoreOptions<S>> = {
  [key in keyof S[Keys.actions]]: (context: Store<S>, payload: any) => void
}

export type Subscribers = { [key: string]: SubscriberOptions[] }

export type SubscriberOptions = {
  before?: Function
  after?: Function
}

export type StoreOptions<S> = {
  state: State<S>
  mutations?: Mutations<S>
  actions?: Actions<S>
}

export type Store<S extends StoreOptions<S>> = {
  state: UnwrapNestedRefs<S[Keys.state]>
  commit: <K extends keyof S[Keys.mutations]>(
    type: K & string,
    payload: any
  ) => void
  dispatch: <K extends keyof S[Keys.actions]>(
    type: K & string,
    payload?: any
  ) => Promise<any>
  subscribeMutation: <K extends keyof S[Keys.mutations]>(
    type: K & string,
    fn: Function | SubscriberOptions
  ) => () => void
  subscribeAction: <K extends keyof S[Keys.actions]>(
    type: K & string,
    fn: Function | SubscriberOptions
  ) => () => void
}
