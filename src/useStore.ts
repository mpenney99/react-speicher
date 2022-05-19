import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { Store } from './createStore';

export function useStore<S, A, T>(
    store: Store<S, A>,
    selector: (state: S) => T,
    eq?: (prev: T, next: T) => boolean
) {
    return useSyncExternalStoreWithSelector(store.subscribe, store.getState, store.getState, selector, eq);
}
