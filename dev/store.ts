import { Store } from '@/types'
import { UnwrapNestedRefs } from 'vue'

type Maybe<T> = T | null

export type Users = {
  url: string
  options: object
}

export interface IUsersStore {
  state: IUsersState
  mutations: IUsersMutations
  actions: IUsersActions
}

export interface IUsersState {
  users: Maybe<{ url: string; options: object }>
}

export interface IUsersMutations {
  setUsers: (state: IUsersState, users: Users) => void
  setUsersUrl: (state: UnwrapNestedRefs<IUsersState>, url: string) => void
}

export interface IUsersActions {
  getUsers: (context: Store<IUsersStore>, payload?: any) => Promise<Users>
}

