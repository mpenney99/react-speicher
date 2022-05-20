/**
 * Wraps an expensive computation
 * @param fn - compute function
 * @param eq - equality comparison
 * @returns 
 */
export function memoize<T, U>(fn: (arg: T) => U, eq?: (prev: T, next: T) => boolean): (arg: T) => U {
    let prev: { value: T; computed: U } | undefined;

    return (arg) => {
        if (!prev || !(prev.value === arg || (eq && eq(prev.value, arg)))) {
            const computed = fn(arg);
            if (!prev) {
                prev = { value: arg, computed };
            } else {
                prev.value = arg;
                prev.computed = computed;
            }
        }

        return prev.computed;
    };
}

/**
 * Shallowly compares the previous and next state
 * @param prev 
 * @param next 
 * @returns true if the inputs are the same
 */
export function shallow<T>(prev: T, next: T): boolean {
    if (prev === next) {
        return true;
    }

    if (prev === null || typeof prev !== 'object' || next === null || typeof next !== 'object') {
        return false;
    }

    const keys = Object.keys(prev);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof T;
        if (prev[key] !== next[key]) {
            return false;
        }
    }

    return true;
}
