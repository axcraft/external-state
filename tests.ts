import { isState, State } from "./index.ts";

let testIndex = 0;

function assert(value: unknown, expectedValue: unknown) {
  let valid = JSON.stringify(value) === JSON.stringify(expectedValue);

  console.log(`000${++testIndex}`.slice(-3), valid ? "Passed" : "Failed");

  if (!valid) throw new Error(`Expected ${expectedValue}, got ${value}.`);
}

let state = new State(10);

let testValue = [100, -3];
let unsubscribe = [
  state.on("update", ({ current }) => {
    testValue[0] += current;
  }),
  state.on("update", ({ current }) => {
    testValue[1] *= current;
  }),
];

assert(isState(state), true);
assert(isState({}), false);

assert(state.getValue(), 10);
assert(state.callbacks.update.size, 2);

state.setValue(2);
assert(state.getValue(), 2);
assert(testValue[0], 102);
assert(testValue[1], -6);

state.setValue(-25);
assert(state.getValue(), -25);
assert(testValue[0], 77);
assert(testValue[1], 150);

unsubscribe[1]();
assert(state.callbacks.update.size, 1);

state.setValue(12);
assert(state.getValue(), 12);
assert(testValue[0], 89);
assert(testValue[1], 150);

console.log();
console.log("Passed");
