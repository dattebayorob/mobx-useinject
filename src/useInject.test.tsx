import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {Provider} from 'mobx-react';
import { useInject } from '.';

class StoreA {
  name = 'Store A';
}

class StoreB {
  name = 'Store B';
}

class StoreC {
  name = 'Store C';
}

const Component = () => {
  const [a, b] = useInject(StoreA, StoreB);
  return <p>{a.name + ' ' + b.name}</p>
}

const ComponentWithC = () => {
  const [c] = useInject(StoreC);
  return <p>{c.name}</p>
}

let container: HTMLDivElement | null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  container && document.body.removeChild(container);
  container = null;
});

describe('useInject', () => {
  it('Should return a tuple with the stores instances', () => {
    act(() => (
      ReactDOM.render(
        <Provider storeA={new StoreA()} storeB={new StoreB()}>
          <Component />
        </Provider>, container
      )
    ));
    const value = container?.querySelector('p');
    expect(value?.textContent).toBe('Store A Store B');
  });
  it('Should throw a exception if a store cant be found', () => {
    expect( () => act(() => (
      ReactDOM.render(
        <Provider storeA={new StoreA()} storeB={new StoreB()}>
          <ComponentWithC />
        </Provider>, container
      )
    ))).toThrowError("StoreC can't be found");
  })
});
