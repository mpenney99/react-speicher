# react-speicher

A dead-simple state management library for React.

React-speicher is a tiny library, with a single dependency on use-sync-external-store.

## API

### createStore

Creates a new store. Takes the following arguments:
* initialState - initial store state
* actions - actions creator
* (optional) computed - computes derived state

### useStore

Hook to select the part of the store to use in your component

### memoize

Utility function to wrap an expensive computation

### shallow

Utility function to shallowly compare the previous and next state

### withDevTools

Integrates the store with the redux devtools extension

## Examples
---

### Basic example

```
import { createStore, useStore } from 'react-speicher';

// create a store
const store = createStore(
    // initial state
    { counter: 0 },
    // actions creator
    ({ get, set }) => ({
        increment() {
            set((state) => ({ counter: state.counter + 1 }));
        }
    })
);

// select the part of the state to use in your component
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

### Computed state

```
import { createStore, memoize } from 'react-speicher';

// expensive computation
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
    // computed state
    (state) => ({
        ...state,
        totalPrice: getTotalPrice(state.basket)
    })
);

```

## DevTools

React-speicher works with the redux-devtools browser extension out of the box.

To enable the integration, simply wrap your store with `withDevTools`:

```
const store = withDevTools(
    createStore(
        { counter: 0 },
        ({ get, set }) => ({
            increment: () => set(
                (state) => ({ counter: state.counter + 1 }),
                'INCREMENT' // <- name of the action in redux devtools
            )
        })
    ),
    // options to pass to devtools
    { name: 'MyStore' }
)
```

## Comparison with Zustand

This library is inspired by Zustand, but has the following advantages:
-   State and actions are separated.
    -   Combined state and actions in Zustand means you have to provide types for the store actions. It's common that you want to explicitly type the store state, but rarer that you want to do the same for actions.
    -   It's possible in Zustand to accidentally remove store actions by calling "replace: true". With react-speicher, actions are separate from state so this is not possible.
-   Need to use custom middleware for computed/derived state
-   Complex typings, especially involving middleware
