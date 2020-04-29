# useInject

```
type User = { id: number, name: string };
// Define a store: 
class Store {
  @observable user?: User;
  @action setUser = (user: User) => { this.user = {...user} }
  @computed 
  get userInfo() {
    if( !user ) return '';
    return `${this.user.id} - ${this.user.name}`
  }
}

const Component = () => {
  const [ store ] = useInject(Store);

  return (
    <p>
      { store.userInfo }
    </p>
  )
}

const App = () => (
  <Provider store={new Store()}>
    <Component />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));



```
