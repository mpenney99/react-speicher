import { useDebugValue } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { Store } from './createStore';

export function useSelector<S, A, T>(
    store: Store<S, A>,
    selector: (state: S) => T,
    eq?: (prev: T, next: T) => boolean
): T {
    const slice = useSyncExternalStoreWithSelector(store.subscribe, store.getState, store.getState, selector, eq);
    useDebugValue(slice);
    return slice;
}
