import { IStore, IStoreOptions } from './types';
export declare const createStore: <S extends IStoreOptions<S>>(options: IStoreOptions<S>) => IStore<S>;
