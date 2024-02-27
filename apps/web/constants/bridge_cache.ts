import { ContractCache } from '@/lib/cache';

const BRIDGE_CACHE_FILES = [
  'lagrange-basis-fp-2048',
  'srs-fp-65536',
  'srs-fq-32768',
  'step-pk-dummybridge-bridge',
  'step-pk-dummybridge-unbridge',
  'step-vk-dummybridge-bridge',
  'step-vk-dummybridge-unbridge',
  'wrap-pk-dummybridge',
  'wrap-vk-dummybridge',
];

export const BRIDGE_CACHE: ContractCache = {
  cachePath: '/dummy_bridge_cache',
  files: BRIDGE_CACHE_FILES,
};
