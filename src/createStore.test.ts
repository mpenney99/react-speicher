import { createStore } from './createStore';

interface CounterState {
    counter: number;
}

function counterState(counter: number): CounterState {
    return { counter };
}

function increment(state: CounterState): CounterState {
    return { counter: state.counter + 1 };
}

test('updates the state', () => {
    const store = createStore(counterState(0), ({ set }) => ({
        increment: () => set(increment)
    }));

    expect(store.getState().counter).toBe(0);

    const fn = jest.fn();
    store.subscribe(fn);
    store.actions.increment();

    expect(store.getState().counter).toBe(1);
    expect(fn).toBeCalledWith(counterState(1));
});

test('derived state', () => {
    const store = createStore(
        { items: ['foo'] },
        ({ set }) => ({
            addItem: (item: string) => {
                set(({ items }) => ({ items: [...items, item] }));
            }
        }),
        (state) => ({
            ...state,
            numItems: state.items.length
        })
    );

    expect(store.getState().numItems).toBe(1);
    expect(store.getState().items).toEqual(['foo']);

    store.actions.addItem('bar');

    expect(store.getState().numItems).toBe(2);
    expect(store.getState().items).toEqual(['foo', 'bar']);
});

test('batching', () => {
    const store = createStore(counterState(0), ({ set, batch }) => ({
        incrementTwice: () => {
            batch(() => {
                set(increment);
                set(increment);
            });
        }
    }));

    expect(store.getState().counter);

    const fn = jest.fn();
    store.subscribe(fn);

    store.actions.incrementTwice();

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith(counterState(2));
});

test('nested batching', () => {
    const store = createStore(counterState(0), ({ set, batch }) => ({
        incrementTwice: () => {
            batch(() => {
                set(increment);
                set(increment);
                batch(() => {
                    set(increment);
                });
            });
        }
    }));

    expect(store.getState().counter);

    const fn = jest.fn();
    store.subscribe(fn);

    store.actions.incrementTwice();

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ counter: 3 });
});

test('debug listener', () => {
    const store = createStore(counterState(0), ({ get, set }) => ({
        increment: () => set(increment, 'INCREMENT')
    }));

    const fn = jest.fn();
    store.debug(fn);

    store.actions.increment();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toBeCalledWith(counterState(1), counterState(0), 'INCREMENT');

    store.actions.increment();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toBeCalledWith(counterState(2), counterState(1), 'INCREMENT');
});
