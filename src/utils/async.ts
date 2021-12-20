export type ResolverTuple<T> = [Error | undefined, T?]

export function resolver<T>(promise: Promise<T>): Promise<ResolverTuple<T>> {
  return promise
    .then((data: T): ResolverTuple<T> => [undefined, data])
    .catch((e: Error): ResolverTuple<T> => [e])
}
