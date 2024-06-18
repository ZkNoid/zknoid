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

const LOTTERY_CACHE_FILES = [
  'lagrange-basis-fp-1024',
  'step-pk-lottery-buyticket',
  'step-vk-lottery-getcommisionforround',
  'lagrange-basis-fp-16384',
  'step-pk-lottery-getcommisionforround',
  'step-vk-lottery-getreward',
  'lagrange-basis-fp-8192',
  'step-pk-lottery-getreward',
  'step-vk-lottery-produceresult',
  'lagrange-basis-fq-16384',
  'step-pk-lottery-produceresult',
  'step-vk-lottery-refund',
  'srs-fp-65536',
  'step-pk-lottery-refund',
  'wrap-pk-distribution-program',
  'srs-fq-32768',
  'step-vk-distribution-program-addticket',
  'wrap-pk-lottery',
  'step-pk-distribution-program-addticket',
  'step-vk-distribution-program-init',
  'wrap-vk-distribution-program',
  'step-pk-distribution-program-init',
  'step-vk-lottery-buyticket',
  'wrap-vk-lottery',
];

export const BRIDGE_CACHE: ContractCache = {
  cachePath: '/dummy_bridge_cache',
  files: BRIDGE_CACHE_FILES,
};

export const LOTTERY_CACHE: ContractCache = {
  cachePath: '/lottery_cache',
  files: LOTTERY_CACHE_FILES,
};
