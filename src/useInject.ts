import { useContext, useMemo, useRef } from 'react';
import { MobXProviderContext } from 'mobx-react';

type Class = new () => any;

type ExtractTypeFromClass<T> = {
  [K in keyof T]: T[K] extends new () => infer U ? U : never;
};

export function useInject<T = Record<string, any>>(): T;

export function useInject<T extends Class[]>(
  ..._requestedStores: T
): ExtractTypeFromClass<T>;

export function useInject<T extends Class[], U = Record<string, any>>(
  ..._requestedStores: T
): ExtractTypeFromClass<T> | U {
  const mobxContext = useContext(MobXProviderContext) as U;

  const requestedStoresRef = useRef(_requestedStores);

  const requestedStores = useMemo(
    () =>
      requestedStoresRef.current.length > 0 &&
      requestedStoresRef.current.map(findInstance(Object.values(mobxContext))),
    [mobxContext]
  ) as ExtractTypeFromClass<T> | undefined;

  return requestedStores ? requestedStores : mobxContext;
}

const findInstance = <T>(stores: any[]) => (clazz: any): T => {
  const instance = stores.find(store => store instanceof clazz);
  if (!instance) throw new Error(`${(clazz as any).name} can't be found`);
  return instance;
};
