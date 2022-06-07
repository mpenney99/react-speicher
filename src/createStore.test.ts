import { createStore } from './createStore';

test('simple store', () => {
    const store = createStore(
        { counter: 0 },
        ({ set }) => ({
            increment: () => {
                set(({ counter }) => ({ counter: counter + 1 }));
            }
        })
    );
    
    expect(store.getState().counter).toBe(0);
    
    const fn = jest.fn();
    store.subscribe(fn);
    store.actions.increment();

    expect(store.getState().counter).toBe(1);
    expect(fn).toBeCalledWith({ counter: 1 });
});

test('derived state', () => {
    const store = createStore(
        { items: ['foo'] },
        ({ set }) => ({
            addItem: (item: string) => {
                set(({ items }) => ({ items:[...items, item] }))
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
    const store = createStore(
        { counter: 0 },
        ({ set, batch }) => ({
            incrementTwice: () => {
                batch(() => {
                    set(({ counter }) => ({ counter: counter + 1 }));
                    set(({ counter }) => ({ counter: counter + 1 }));
                });
            }
        })
    );

    expect(store.getState().counter)

    const fn = jest.fn();
    store.subscribe(fn);

    store.actions.incrementTwice();

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ counter: 2 });
});

test('nested batching', () => {
    const store = createStore(
        { counter: 0 },
        ({ set, batch }) => ({
            incrementTwice: () => {
                batch(() => {
                    set(({ counter }) => ({ counter: counter + 1 }));
                    set(({ counter }) => ({ counter: counter + 1 }));
                    batch(() => {
                        set(({ counter }) => ({ counter: counter + 1 }));
                    });
                });
            }
        })
    );

    expect(store.getState().counter)

    const fn = jest.fn();
    store.subscribe(fn);

    store.actions.incrementTwice();

    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith({ counter: 3 });
});

