import { useEffect, useMemo, useRef, useState } from "react";
import { State } from "../State.ts";
import { isState } from "../isState.ts";

export type SetStoreValue<T> = State<T>["setValue"];
export type ShouldUpdateCallback<T> = (nextValue: T, prevValue: T) => boolean;
export type ShouldUpdate<T> = boolean | ShouldUpdateCallback<T>;

export function usePortableState<T>(
  state: State<T>,
  shouldUpdate: ShouldUpdate<T> = true,
): [T, SetStoreValue<T>] {
  if (!isState<T>(state))
    throw new Error("'state' is not an instance of State");

  let [, setRevision] = useState(-1);

  let setValue = useMemo(() => state.setValue.bind(state), [state]);
  let initialStoreRevision = useRef(state.revision);

  useEffect(() => {
    // Allow state instances to hook into the effect
    state.emit("effect");

    if (!shouldUpdate) return;

    let unsubscribe = state.on("update", () => {
      if (typeof shouldUpdate !== "function" || shouldUpdate(state.current, state.previous))
        setRevision(Math.random());
    });

    if (state.revision !== initialStoreRevision.current)
      setRevision(Math.random());

    return () => {
      unsubscribe();
      initialStoreRevision.current = state.revision;
    };
  }, [state, shouldUpdate]);

  return [state.current, setValue];
}
