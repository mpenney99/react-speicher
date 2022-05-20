export type StoreSetter<S> = (state: S) => Partial<S> | undefined | null;

export interface StoreApi<S> {
    get: () => S;
    set: (state: Partial<S> | StoreSetter<S>) => void;
}

export type StoreListener<T> = (state: T) => void;

export interface Store<S, A> {
    actions: A;
    getState(): S;
    subscribe: (listener: StoreListener<S>) => () => void;
}

/**
 * Creates a store
 * @param initialState - initial store state
 * @param actionsCreator - function returning the actions to mutate the store
 * @param mapper - computes derived state
 */

export function createStore<S1, A, S2 = S1>(
    initialState: S1,
    actionsCreator: (api: StoreApi<S1>) => A,
    mapper?: (state: S1) => S2
): Store<S2, A> {
    const listeners = new Set<StoreListener<S2>>();
    let state: S1 = initialState;
    let derivedState: S2 = state as unknown as S2;

    if (mapper) {
        derivedState = mapper(state);
    }
    
    function get() {
        return state;
    }

    function set(nextState: Partial<S1> | StoreSetter<S1> | undefined | null) {
        let s = nextState;
        if (typeof s === 'function') {
            s = s(state);
        }

        if (s == null || state === s) {
            return;
        }

        state = Object.assign({}, state, s);
        derivedState = state as unknown as S2;

        if (mapper) {
            derivedState = mapper(state);
        }

        listeners.forEach((listener) => {
            listener(derivedState)
        });
    }

    return {
        getState() {
            return derivedState
        },
        actions: actionsCreator({ get, set }),
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        }
    };
}
