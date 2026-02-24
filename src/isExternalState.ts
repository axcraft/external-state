import type { ExternalState } from "./ExternalState.ts";

/**
 * Serves as a replacement to `instanceof ExternalState` which can lead to
 * a false negative when `ExternalState` comes from transitive dependencies.
 */
export function isExternalState<T>(x: unknown): x is ExternalState<T> {
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
