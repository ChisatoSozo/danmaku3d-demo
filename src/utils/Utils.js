import { useEffect, useRef } from 'react';

export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const filterInPlace = (a, condition) => {
    let i = 0,
        j = 0;

    while (i < a.length) {
        const val = a[i];
        if (condition(val, i, a)) a[j++] = val;
        i++;
    }

    a.length = j;
    return a;
};

const usePrevious = (value, initialValue) => {
    const ref = useRef(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
    const previousDeps = usePrevious(dependencies, []);

    const changedDeps = dependencies.reduce((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index;
            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency,
                },
            };
        }

        return accum;
    }, {});

    if (Object.keys(changedDeps).length) {
        console.log('[use-effect-debugger] ', changedDeps);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effectHook, dependencies);
};
export const useTraceUpdate = (props) => {
    const prev = useRef(props);
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
}

export const capFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const mod = (n, m) => {
    return ((n % m) + m) % m;
};

export const staticReplace = (obj, prop, index, value) => {
    const newArray = [...obj[prop]];
    newArray[index] = value;
    obj[prop] = newArray;
};

export const rerange = (oldValue, oldMin, oldMax, newMin, newMax) => {
    const oldRange = (oldMax - oldMin)
    const newRange = (newMax - newMin)
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin
}

export const determineOrder = arr => {
    if (arr.length < 2) {
        return 'not enough items';
    };
    let ascending = null;
    let nextArr = arr.slice(1);
    for (var i = 0; i < nextArr.length; i++) {
        if (nextArr[i] === arr[i]) {
            continue;
        } else if (ascending === null) {
            ascending = nextArr[i] > arr[i];
        } else if (ascending !== (nextArr[i] > arr[i])) {
            return 'unsorted';
        };
    }
    if (ascending === null) {
        return 'all items are equal';
    };
    return ascending ? 'ascending' : 'descending';
};

export const sum = (array1, array2) => array1.map(function (num, idx) {
    return num + array2[idx];
});