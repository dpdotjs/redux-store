export class Store {
  private subscribers: Function[];
  private reducers: { [Key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducers = {}, initialState = {}) {
    this.subscribers = [];
    this.reducers = reducers;
    this.state = this.reduce(initialState, {});
  }

  get value() {
    return this.state;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    this.notify();
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== fn);
    };
  }

  dispatch(action) {
    this.state = this.reduce(this.state, action);
    this.notify();
  }

  private reduce(state, action) {
    const newState = {};

    for (const prop in this.reducers) {
      newState[prop] = this.reducers[prop](state[prop], action);
    }
    console.log('NEWSTATE:::', newState);
    return newState;
  }

  private notify() {
    this.subscribers.forEach(fn => fn(this.value));
  }
}
