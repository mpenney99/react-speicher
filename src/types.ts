export type StoreSetterCallback<S> = (state: S) => Partial<S> | undefined | null;

export type StoreSetter<S> = (state: Partial<S> | StoreSetterCallback<S>, action?: string) => void;

export type StoreGetter<S> = () => S;

export type StoreBatcher = (callback: () => void) => void;

export interface StoreApi<S> {
    get: StoreGetter<S>;
    set: StoreSetter<S>;
    batch: StoreBatcher;
}

export type StoreListener<S> = (state: S) => void;

export type StoreDebugListener<S> = (nextState: S, prevState: S, action?: string) => void;

export interface Store<S, A, C> {
    actions: A;
    getState: StoreGetter<S & C>;
    setState: StoreSetter<S>;
    batch: StoreBatcher;
    subscribe: (listener: StoreListener<S & C>) => () => void;
    debug: (listener: StoreDebugListener<S>, immediate?: boolean) => () => void;
}
