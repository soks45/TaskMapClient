export type DeepReadOnly<T> =
    T extends (infer R)[] ? DeepReadOnlyArray<R> :
        T extends Function ? T :
            T extends object ? DeepReadOnlyObject<T> :
                T;

interface DeepReadOnlyArray<T> extends ReadonlyArray<DeepReadOnly<T>> {
}

type DeepReadOnlyObject<T> = {
    readonly [P in keyof T]: DeepReadOnly<T[P]>
}
