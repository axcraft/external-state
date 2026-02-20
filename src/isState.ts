import type { State } from "./State.ts";

/**
 * Serves as a replacement to `instanceof State` which can lead to a false
 * negative when the `State` class comes from different package dependencies.
 */
export function isState<T>(x: unknown): x is State<T> {
  return (
    x !== null &&
    typeof x === "object" &&
    "on" in x &&
    typeof x.on === "function" &&
    "getValue" in x &&
    typeof x.getValue === "function" &&
    "setValue" in x &&
    typeof x.setValue === "function"
  );
}
