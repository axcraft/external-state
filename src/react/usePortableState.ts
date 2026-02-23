import { useEffect, useMemo, useRef, useState } from "react";
import { PortableState } from "../PortableState.ts";
import { isPortableState } from "../isPortableState.ts";
import { EventPayload } from "../types/EventPayload.ts";
import { RenderCallback } from "../types/RenderCallback.ts";

export type SetStoreValue<T> = PortableState<T>["setValue"];
export type ShouldUpdateCallback<T> = (nextValue: T, prevValue: T) => boolean;
export type ShouldUpdate<T> = boolean | ShouldUpdateCallback<T>;

const defaultRenderCallback = (render: () => void) => render();

export function usePortableState<T, P extends EventPayload>(
  state: PortableState<T, P>,
  callback: RenderCallback<P> = defaultRenderCallback,
): [T, SetStoreValue<T>] {
  if (!isPortableState<T>(state))
    throw new Error("'state' is not an instance of PortableState");

  let [, setRevision] = useState(-1);

  let setValue = useMemo(() => state.setValue.bind(state), [state]);
  let initialStoreRevision = useRef(state.revision);
  let shouldUpdate = useRef(false);

  useEffect(() => {
    // Allow state instances to hook into the effect
    state.emit("effect");

    shouldUpdate.current = true;

    let render = () => {
      // Use `setRevision()` as long as the component is mounted
      if (shouldUpdate.current) setRevision(Math.random());
    };

    let unsubscribe = state.on("update", (payload) => {
      callback(render, payload);
    });

    if (state.revision !== initialStoreRevision.current)
      setRevision(Math.random());

    return () => {
      unsubscribe();
      initialStoreRevision.current = state.revision;
      shouldUpdate.current = false;
    };
  }, [state, callback]);

  return [state.current, setValue];
}
