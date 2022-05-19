export type Setter<S> = (state: S) => Partial<S> | undefined | null;

export interface StoreApi<S> {
    get: () => S;
    set: (state: Partial<S> | Setter<S>) => void;
}

export type Listener<T> = (state: T) => void;

export interface Store<S, A> {
    actions: A;
    getState(): S;
    subscribe: (listener: Listener<S>) => () => void;
}

export function createStore<S, A>(
    initialState: S,
    actionsCreator: (api: StoreApi<S>) => A
): Store<S, A>;

export function createStore<S1, A, S2>(
    initialState: S1,
    actionsCreator: (api: StoreApi<S1>) => A,
    mapper: (state: S1) => S2
): Store<S2, A>;

export function createStore<S1, A, S2>(
    initialState: S1,
    actionsCreator: (api: StoreApi<S1>) => A,
    mapper?: (state: S1) => S2
): Store<S2, A> {
    const listeners = new Set<Listener<S2>>();
    let state: S1 = initialState;
    let derivedState: S2 = state as unknown as S2;

    if (mapper) {
        derivedState = mapper(state);
    }

    function subscribe(listener: Listener<S2>) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }
    
    function get() {
        return state;
    }

    function set(nextState: Partial<S1> | Setter<S1>) {
        let s: Partial<S1> | undefined | null;
        if (typeof nextState === 'function') {
            s = (nextState as Setter<S1>)(state);
        }

        if (s == null || state === s) {
            return;
        }

        state = Object.assign({}, state, s);

        derivedState = state as unknown as S2;
        if (mapper) {
            derivedState = mapper(state);
        }

        listeners.forEach((li) => li(derivedState));
    }

    const actions = actionsCreator({ get, set });

    return {
        getState() {
            return derivedState
        },
        actions,
        subscribe
    };
}
