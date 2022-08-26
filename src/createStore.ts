import {
    StoreApi,
    Store,
    StoreListener,
    StoreDebugListener,
    StoreGetter,
    StoreSetter,
    StoreBatcher
} from './types';

/**
 * Creates a store
 * @param initialState - initial state
 * @param actionsCreator - actions creator
 * @param computed - computed state
 */
export function createStore<S, A, C>(
    initialState: S,
    actions?: (api: StoreApi<S>) => A,
    computed?: (state: S) => C
): Store<S, A, C> {
    const listeners = new Set<StoreListener<S & C>>();
    const debugListeners = new Set<StoreDebugListener<S>>();

    let state: S = initialState;
    let derivedState: S & C = state as S & C;
    let batchCount = 0;
    let needsUpdate = false;

    if (computed) {
        derivedState = Object.assign({}, state, computed(state));
    }

    const update = () => {
        derivedState = computed ? Object.assign({}, state, computed(state)) : (state as S & C);
        if (listeners.size) {
            listeners.forEach((listener) => {
                listener(derivedState);
            });
        }
    };

    const getDerivedState: StoreGetter<S & C> = () => derivedState;

    const getState: StoreGetter<S> = () => state;

    const setState: StoreSetter<S> = (updatedState, action) => {
        const partialState =
            typeof updatedState === 'function' ? updatedState(state) : updatedState;

        if (partialState == null || state === partialState) {
            return;
        }

        const prevState = state;
        state = Object.assign({}, state, partialState);

        if (debugListeners.size) {
            debugListeners.forEach((listener) => {
                listener(state, prevState, action);
            });
        }

        if (batchCount > 0) {
            needsUpdate = true;
            return;
        }

        update();
    };

    const batch: StoreBatcher = (callback) => {
        if (batchCount === 0) {
            needsUpdate = false;
        }

        batchCount++;

        callback();

        batchCount--;

        if (needsUpdate && batchCount === 0) {
            update();
        }
    };

    const subscribe = (listener: StoreListener<S & C>) => {
        listeners.add(listener);
        return () => void listeners.delete(listener);
    };

    const debug = (listener: StoreDebugListener<S>, immediate?: boolean) => {
        debugListeners.add(listener);

        if (immediate) {
            listener(state, state);
        }

        return () => void debugListeners.delete(listener);
    };

    const api: StoreApi<S> = { get: getState, set: setState, batch };

    return {
        getState: getDerivedState,
        setState,
        actions: actions?.(api) ?? ({} as A),
        batch,
        subscribe,
        debug
    };
}
