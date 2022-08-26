import { useDebugValue } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { Store } from './types';

export function useStore<S, A, C, T>(
    store: Store<S, A, C>,
    selector: (state: S & C) => T,
    eq?: (prev: T, next: T) => boolean
): T {
    const slice = useSyncExternalStoreWithSelector(
        store.subscribe,
        store.getState,
        store.getState,
        selector,
        eq
    );
    useDebugValue(slice);
    return slice;
}
