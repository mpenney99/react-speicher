import { memoize, shallow } from './utils';

test('memoizes a value', () => {
    const fn = jest.fn().mockImplementation((x) => x);
    const compute = memoize(fn);

    expect(compute(2)).toBe(2);
    expect(compute(1)).toBe(1);
    expect(compute(1)).toBe(1);
    expect(compute(1)).toBe(1);
    expect(compute(3)).toBe(3);
    expect(compute(2)).toBe(2);

    expect(fn).toHaveBeenCalledTimes(4);
});

test('shallowly compares values', () => {
    expect(shallow({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallow({ a: 1 }, { a: 2 })).toBe(false);
    expect(shallow({ a: 1 }, { a: 2 })).toBe(false);
    expect(shallow({ a: 1, b: 1 }, { a: 1 })).toBe(false);
    expect(shallow({ a: 1 }, null)).toBe(false);
    expect(shallow(null, { a: 1 })).toBe(false);
    expect(shallow(null, null)).toBe(true);
    expect(shallow(null, undefined)).toBe(false);
});

test('memoize with shallow compare', () => {
    const fn = jest.fn().mockImplementation(({ a, b }: { a: number, b: number }) => a + b);
    const compute = memoize(fn, shallow);

    expect(compute({ a: 1, b: 2 })).toEqual(3);
    expect(compute({ a: 1, b: 2 })).toEqual(3);
    expect(compute({ a: 1, b: 2 })).toEqual(3);
    expect(compute({ a: 2, b: 3 })).toEqual(5);

    expect(fn).toHaveBeenCalledTimes(2);
});

