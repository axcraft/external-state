import type { PortableState } from "./PortableState.ts";

/**
 * Serves as a replacement to `instanceof State` which can lead to a false
 * negative when the `State` class comes from different package dependencies.
 */
export function isPortableState<T>(x: unknown): x is PortableState<T> {
  return (
    x !== null &&
    typeof x === "object" &&
    "on" in x &&
    typeof x.on === "function" &&
    "emit" in x &&
    typeof x.emit === "function" &&
    "setValue" in x &&
    typeof x.setValue === "function"
  );
}
