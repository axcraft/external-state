import type { LocationValue } from "./LocationValue.ts";
import type { URLConfig } from "./URLConfig.ts";

export type LocationPattern = URLConfig["strict"] extends true
  ? LocationValue | LocationValue[]
  : LocationValue | RegExp | (LocationValue | RegExp)[];
