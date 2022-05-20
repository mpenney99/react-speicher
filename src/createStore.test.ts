import { createStore } from './createStore';

test('counter store', () => {
    const store = createStore(
        { counter: 1 },
        ({ set }) => ({
            increment: () => {
                set(({ counter }) => ({ counter: counter + 1 }));
            }
        })
    );
    
    expect(store.getState().counter).toBe(1);
    
    const fn = jest.fn();
    store.subscribe(fn);
    store.actions.increment();

    expect(store.getState().counter).toBe(2);
    expect(fn).toBeCalledWith({ counter: 2 });
});

test('derived state', () => {
    const store = createStore(
        { items: ['foo'] },
        ({ set }) => ({
            addItem: (item: string) => {
                set(({ items }) => ({ items: items.concat([item]) }))
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
