import { useContext, useMemo, useRef } from 'react';
import { MobXProviderContext } from 'mobx-react';

type ExtractTypeFromClass<T> = {
  [K in keyof T]: T[K] extends new () => infer U ? U : never;
};

export default <T extends (new () => any)[]>(..._requestedStores: T) => {
  const requestedStores = useRef(_requestedStores);
  const contextsObject = useContext(MobXProviderContext);

  return useMemo(
    () =>
      requestedStores.current.map(findInstance(Object.values(contextsObject))),
    [contextsObject]
  ) as ExtractTypeFromClass<T>;
};

const findInstance = <T>(stores: any[]) => (clazz: any): T => {
  const instance = stores.find(store => store instanceof clazz);
  if (!instance) throw new Error(`${(clazz as any).name} can't be found`);
  return instance;
};
