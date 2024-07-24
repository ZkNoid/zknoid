#!/usr/bin/env node --experimental-specifier-resolution=node --experimental-vm-modules --experimental-wasm-modules --experimental-wasm-threads

import { startEnvironment } from "@proto-kit/deployment";
import env from "../src/environments";

// await startEnvironment(env);