import { useContext, useMemo, useState } from 'react';
import { MobXProviderContext } from 'mobx-react';

type ExtractTypeFromClass<T> = {
  [K in keyof T]: T[K] extends (new () => infer U) ? U : never;
}

export default <T extends (new () => any)[]>(..._requestedStores: T) => {
  const [ requestedStores ] = useState(_requestedStores);
  const contextsObject = useContext(MobXProviderContext);

  return useMemo(
    () => requestedStores.map(findInstance(Object.values(contextsObject))), [requestedStores, contextsObject]
  ) as ExtractTypeFromClass<T>;
}

const findInstance = <T>(stores: any[]) => (clazz: any): T => {
  const instance = stores.find(store => store instanceof clazz);
  if (!instance) throw new Error(`${(clazz as any).name} can't be found`);
  return instance;
}