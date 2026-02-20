export type StateUpdate<T> = (value: T) => T;
export type StateUpdateCallback<T> = (state: State<T>) => void;

/**
 * Data container allowing for subscription to its updates.
 */
export class State<T> {
  current: T;
  previous: T;
  callbacks: Record<string, Set<StateUpdateCallback<T>>> = {};
  revision = -1;
  constructor(value: T) {
    this.previous = value;
    this.current = value;
  }
  /**
   * Adds an event handler to the state.
   *
   * Handlers of the `"update"` event are called whenever the state value
   * is updated via `setValue(value)`.
   *
   * Returns an unsubscription function. Once it's invoked, the given
   * `callback` is removed from the state and no longer called when
   * the state emits the corresponding event.
   */
  on(event: string, callback: StateUpdateCallback<T>) {
    (this.callbacks[event] ??= new Set<StateUpdateCallback<T>>()).add(callback);

    return () => this.off(event, callback);
  }
  /**
   * Adds a one-time event handler to the state: once the event is emitted,
   * the callback is called and removed from the state.
   */
  once(event: string, callback: StateUpdateCallback<T>) {
    let oneTimeCallback: StateUpdateCallback<T> = (state) => {
      this.off(event, oneTimeCallback);
      callback(state);
    };

    return this.on(event, oneTimeCallback);
  }
  /**
   * Removes `callback` from the state's handlers of the given event,
   * and removes all handlers of the given event if `callback` is not
   * specified.
   */
  off(event: string, callback?: StateUpdateCallback<T>) {
    if (callback === undefined) delete this.callbacks[event];
    else this.callbacks[event]?.delete(callback);
  }
  emit(event: string) {
    if (this.callbacks[event]?.size) {
      for (let callback of this.callbacks[event]) callback(this);
    }
  }
  /**
   * Returns the current state value.
   */
  getValue() {
    return this.current;
  }
  /**
   * Updates the state value.
   *
   * @param update - A new value or an update function `(value) => nextValue`
   * that returns a new state value based on the current state value.
   */
  setValue(update: T | StateUpdate<T>) {
    this.previous = this.current;
    this.current = update instanceof Function ? update(this.current) : update;
    this.revision = Math.random();
    this.emit("update");
  }
}
