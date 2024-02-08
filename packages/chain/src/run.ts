#!/usr/bin/env node --experimental-specifier-resolution=node --experimental-vm-modules --experimental-wasm-modules --experimental-wasm-threads

import { PrivateKey, UInt64 } from 'o1js';

import appChain from './chain.config';
import { ManualBlockTrigger } from '@proto-kit/sequencer';

await appChain.start();
const trigger = appChain.sequencer.resolveOrFail("BlockTrigger", ManualBlockTrigger);
setInterval(async () => {
    console.log('Tick');
  try {
    await trigger.produceUnproven();
  } catch (e) {
    console.error(e);
  }
}, 5000)