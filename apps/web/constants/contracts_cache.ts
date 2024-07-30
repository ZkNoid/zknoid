import { ContractCache } from '@/lib/cache';

const LOTTERY_CACHE_LIST = [
  'lagrange-basis-fp-1024',
  'lagrange-basis-fp-1024.header',
  'lagrange-basis-fp-16384',
  'lagrange-basis-fp-16384.header',
  'lagrange-basis-fp-2048',
  'lagrange-basis-fp-2048.header',
  'lagrange-basis-fp-32768',
  'lagrange-basis-fp-32768.header',
  'lagrange-basis-fp-4096',
  'lagrange-basis-fp-4096.header',
  'lagrange-basis-fp-8192',
  'lagrange-basis-fp-8192.header',
  'lagrange-basis-fq-16384',
  'lagrange-basis-fq-16384.header',
  'srs-fp-65536',
  'srs-fp-65536.header',
  'srs-fq-32768',
  'srs-fq-32768.header',
  'step-pk-distribution-program-addticket.header',
  'step-pk-distribution-program-init',
  'step-pk-distribution-program-init.header',
  'step-pk-plottery-buyticket',
  'step-pk-plottery-buyticket.header',
  'step-pk-plottery-getreward.header',
  'step-pk-plottery-produceresult',
  'step-pk-plottery-produceresult.header',
  'step-pk-plottery-reducetickets.header',
  'step-pk-plottery-refund.header',
  'step-pk-ticket-reduce-program-addticket.header',
  'step-pk-ticket-reduce-program-cutactions.header',
  'step-pk-ticket-reduce-program-init',
  'step-pk-ticket-reduce-program-init.header',
  'step-vk-distribution-program-addticket',
  'step-vk-distribution-program-addticket.header',
  'step-vk-distribution-program-init',
  'step-vk-distribution-program-init.header',
  'step-vk-plottery-buyticket',
  'step-vk-plottery-buyticket.header',
  'step-vk-plottery-getreward',
  'step-vk-plottery-getreward.header',
  'step-vk-plottery-produceresult',
  'step-vk-plottery-produceresult.header',
  'step-vk-plottery-reducetickets',
  'step-vk-plottery-reducetickets.header',
  'step-vk-plottery-refund',
  'step-vk-plottery-refund.header',
  'step-vk-ticket-reduce-program-addticket',
  'step-vk-ticket-reduce-program-addticket.header',
  'step-vk-ticket-reduce-program-cutactions',
  'step-vk-ticket-reduce-program-cutactions.header',
  'step-vk-ticket-reduce-program-init',
  'step-vk-ticket-reduce-program-init.header',
  'wrap-pk-distribution-program.header',
  'wrap-pk-plottery.header',
  'wrap-pk-ticket-reduce-program.header',
  'wrap-vk-distribution-program',
  'wrap-vk-distribution-program.header',
  'wrap-vk-plottery',
  'wrap-vk-plottery.header',
  'wrap-vk-ticket-reduce-program',
  'wrap-vk-ticket-reduce-program.header',
];

export const LOTTERY_CACHE: ContractCache = {
  cachePath: '/dummy_bridge_cache',
  files: LOTTERY_CACHE_LIST,
  urls: LOTTERY_CACHE_LIST.map((x) => `/lottery_cache/${x}`),
};

console.log('Lottery cache', LOTTERY_CACHE);
