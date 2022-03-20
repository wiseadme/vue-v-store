import { UnwrapNestedRefs } from 'vue'

export enum Keys {
  state = 'state',
  mutations = 'mutations',
  actions = 'actions',
}

export declare function createStore<S extends Options<Pattern<S>>>(options: S): Store<S>
export declare function logError(msg: string): void
export declare function logWarn(msg: string): void
export declare function isAsyncFunction(fn: Function): boolean
export declare function hasAsyncLogic(fn: Function): boolean

export type State<S> = { [key in keyof S]: S[key] }
export type Mutations<S, M> = { [key in keyof M]: (state: S, payload: any) => void }
export type Actions<S, A> = { [key in keyof A]: (context: Store<S>, payload: any) => any }

export type Pattern<S extends Partial<Record<Keys, any>>> = {
  state: State<S[Keys.state]>
  mutations: Mutations<S[Keys.state], S[Keys.mutations]>
  actions: Actions<S, S[Keys.actions]>
}

export type Store<S extends Partial<Record<Keys, any>>> = {
  state: UnwrapNestedRefs<S[Keys.state]>
  commit: <K extends keyof S[Keys.mutations]>(
    type: K,
    payload: any
  ) => void
  dispatch: <K extends keyof S[Keys.actions]>(
    type: K,
    payload?: any
  ) => Promise<any>
  subscribeMutation: <K extends keyof S[Keys.mutations]>(
    type: K,
    fn: Function | SubscriberOptions
  ) => () => void
  subscribeAction: <K extends keyof S[Keys.actions]>(
    type: K,
    fn: Function | SubscriberOptions
  ) => () => void
}

export type MutationSubscribers<S extends Pattern<S>> = {
  [K in keyof S[Keys.mutations]]: SubscriberOptions[]
}
export type ActionSubscribers<S extends Pattern<S>> = {
  [K in keyof S[Keys.actions]]: SubscriberOptions[]
}

export type Subscribers<S extends Pattern<S>> = MutationSubscribers<S> | ActionSubscribers<S>
export type Options<T> = T extends unknown ? Record<Keys, any> : T

export type SubscriberOptions = {
  before?: Function
  after?: Function
}
