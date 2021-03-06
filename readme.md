# react-speicher

A dead-simple state management library for React.

Inspired by Zustand. React-speicher is a tiny library, with a single dependency on use-sync-external-store.

## API

### createStore

Takes three arguments:
* initialState - initial store state
* actionsCreator - a function returning the actions to mutate the store
* mapper (optional) - computes derived state

### useStore

Hook to select the part of the store to use in your component

## Utilities

### memoize

Utility function to wrap an expensive computation

### shallow

Utility function to shallow compare the previous and next state

## Examples
---

Basic example:

```
import { createStore, useStore } from 'react-speicher';

const store = createStore(
    { counter: 0 },
    ({ get, set }) => ({
        increment() {
            set((state) => ({ counter: state.counter + 1 }));
        }
    })
);

function MyComponent() {
    const counter = useStore(store, (state) => state.counter);
    return (
        <button onClick={() => {
            store.actions.increment();
        }}>
            Clicked {counter} times
        </button>
    );
}
```

Computed state:

```
import { createStore, memoize } from 'react-speicher';

const getTotalPrice = memoize((items) => {
    return items.reduce((acc, item) => acc + item.price, 0);
});

const store = createStore(
    { basket: [] },
    ({ get, set }) => ({
        addItem(item) {
            set((state) => ({
                basket: state.basket.concat([item])
            }));
        }
    }),
    (state) => ({
        ...state,
        // expensive computation
        totalPrice: getTotalPrice(state.basket)
    })
);

```

## Why did you create this library?

After React 18 was released with the useSyncExternalStore hook, it has become easy to create new state-management libraries for React.
This library is directly inspired by Zustand, but addresses the following issues with it's API design:
-   State and actions are combined together.
    -   Difficult to work with in TypeScript. You have to type all the actions in the State interface.
-   Need to use a custom middleware for computed/derived state
