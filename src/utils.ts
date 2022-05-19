export function memoize<T, U>(fn: (value: T) => U, eq?: (prev: T, next: T) => boolean) {
    let prev: { value: T; computed: U } | undefined;

    return (value: T) => {
        if (!prev || !(prev.value === value || (eq && eq(prev.value, value)))) {
            const computed = fn(value);
            if (!prev) {
                prev = { value, computed };
            } else {
                prev.value = value;
                prev.computed = computed;
            }
        }

        return prev.computed;
    };
}

export function shallow<T extends object>(prev: T, next: T) {
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
