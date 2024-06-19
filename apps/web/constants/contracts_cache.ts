import { ContractCache } from '@/lib/cache';
import { head, list } from '@vercel/blob';

const VERCEL_LOTTERY_CACHE = [
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-1024-kDfJ1PgEm6MsiqhqB9qLEavsf4hD55',
    pathname: 'lagrange-basis-fp-1024',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-1024-pCZCye66UwtrDicIdh8g2bgDu6fgoO.header',
    pathname: 'lagrange-basis-fp-1024.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-16384-6UkC2ZIB2nW06auDOapbbrFGK3vRDk.header',
    pathname: 'lagrange-basis-fp-16384.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-16384-T5bKfYMJ9s7hbU4X0RsBY26PowawqD',
    pathname: 'lagrange-basis-fp-16384',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-8192-6eKpZ3hQFK7S0zlsFPvnyE6g9Far3H',
    pathname: 'lagrange-basis-fp-8192',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-8192-D7a94M4eUuD8njV0OWxfna1i16M2Pp.header',
    pathname: 'lagrange-basis-fp-8192.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fq-16384-2MSDDJ15nkcZo4ErnhACZ6JGeLymQW',
    pathname: 'lagrange-basis-fq-16384',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fq-16384-hmEAnNlHxj56mZE7QLUMp5Nhm4Nolk.header',
    pathname: 'lagrange-basis-fq-16384.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fp-65536-COzfjswj7jGC4KRGPNE4QM4QM9y5Ik',
    pathname: 'srs-fp-65536',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fp-65536-xGci9TMHx64BNKkYG2sWg6cDlL36cQ.header',
    pathname: 'srs-fp-65536.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fq-32768-9xZyaL0KFkGWUJbfS2V9HhgYFK9oNx.header',
    pathname: 'srs-fq-32768.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fq-32768-impmM6KwlQvJNRsXrc4Y6Tk9XdijkX',
    pathname: 'srs-fq-32768',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-addticket-Kpvt1U3H1mV43HLtXO16LWFwwqQC6U.header',
    pathname: 'step-pk-distribution-program-addticket.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-addticket-YhUfoNE2H88CWRll1FBnfhQC7w8YGj',
    pathname: 'step-pk-distribution-program-addticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-init-DdRiykr85L7tNEGYSQy9u5KySCRTRD',
    pathname: 'step-pk-distribution-program-init',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-init-xDO122uhUc6r8v9GTIWES8EyOlzqCn.header',
    pathname: 'step-pk-distribution-program-init.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-buyticket-F2MfrknQmSMntIRZmlUcAanm4eq5XB',
    pathname: 'step-pk-lottery-buyticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-buyticket-mzv7KEugG63m83qcFRvIWKaOIGGnHy.header',
    pathname: 'step-pk-lottery-buyticket.header',
  },
  // {
  //   url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getcommisionforround-FmrmRDHTg68itIe9leE6sfpNmd6THK',
  //   pathname: 'step-pk-lottery-getcommisionforround',
  // },
  // {
  //   url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getcommisionforround-iLVXnKaF8EBCIEwQsPNWgSt6a6rRCj.header',
  //   pathname: 'step-pk-lottery-getcommisionforround.header',
  // },
  // {
  //   url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getreward-99VRX2wZOIOirJOL8DnT9plmjkbyD2',
  //   pathname: 'step-pk-lottery-getreward',
  // },
  // {
  //   url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getreward-bjqmW5gO85SJ4x1fbHZ0FZ4v598ytM.header',
  //   pathname: 'step-pk-lottery-getreward.header',
  // },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-produceresult-ePKptkqZzOS7ANlWHNNRK2abkrvGk0.header',
    pathname: 'step-pk-lottery-produceresult.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-produceresult-lC4ymOAIMk5xHfj9muTnjgjLqbhP2k',
    pathname: 'step-pk-lottery-produceresult',
  },
  // {
  //   url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-refund-DqzUSFgO55TtyYEVrUGc7dGxLtAnBR',
  //   pathname: 'step-pk-lottery-refund',
  // },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-refund-do4YicosnaGsDD2oEp9oYSMdqrsahj.header',
    pathname: 'step-pk-lottery-refund.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-addticket-aK6pOZGRmaJ3RGn8aCDe5KYlUXrPPG',
    pathname: 'step-vk-distribution-program-addticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-addticket-qYcRH4LsIGaU6UBbHnYpHmj7VHNC33.header',
    pathname: 'step-vk-distribution-program-addticket.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-init-JtLphlv4pb9nYaUpfdJWeseE6NE0Pt.header',
    pathname: 'step-vk-distribution-program-init.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-init-wDWOjdBJ2QAHO9fcVtdMqS02logOGB',
    pathname: 'step-vk-distribution-program-init',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-buyticket-M9DhIlCiqa3VKUGeEGU2lgp8BnjJsH.header',
    pathname: 'step-vk-lottery-buyticket.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-buyticket-hqg2NqCDzAHyz8lfRRWoWOu3k0DkWi',
    pathname: 'step-vk-lottery-buyticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getcommisionforround-FxKHJ3cwONrb0n0ly4EIi9llc7FJHq.header',
    pathname: 'step-vk-lottery-getcommisionforround.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getcommisionforround-RszI2KO1gtZYpAN2FDlvMbK8P0gtWX',
    pathname: 'step-vk-lottery-getcommisionforround',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getreward-EQ7eaASyGEdh4Ex6yNchrYgTYnruvd',
    pathname: 'step-vk-lottery-getreward',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getreward-picWN5nU3pKjPIWvTUIFFfD2ZmaAfu.header',
    pathname: 'step-vk-lottery-getreward.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-produceresult-57jZo3OYFJkqHnFUAGMjdlxCmvZT5I',
    pathname: 'step-vk-lottery-produceresult',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-produceresult-jMSJXkKp98JzDLYQnvuBEIlPPd1QLz.header',
    pathname: 'step-vk-lottery-produceresult.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-refund-9DZlD340UTvWcra3vQon1wi8p5pUpV',
    pathname: 'step-vk-lottery-refund',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-refund-lCg05RXapOaaMYrKNZAAzjQsOlvDGa.header',
    pathname: 'step-vk-lottery-refund.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-distribution-program-LzirsQRxfDGaIRENWgUYEZRA7iPW4B',
    pathname: 'wrap-pk-distribution-program',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-distribution-program-MTEXIppiV5gq96ddzu5WC5hMxqJLnK.header',
    pathname: 'wrap-pk-distribution-program.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-lottery-2x0kRKlMh4uffI92RmNy8B21NvA81G.header',
    pathname: 'wrap-pk-lottery.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-lottery-5nhlSnJDLoaEWGEuOmS6w2lJFXsbnj',
    pathname: 'wrap-pk-lottery',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-distribution-program-FHiQDyjOc5gSwzLuKWCG8vt425cTp1',
    pathname: 'wrap-vk-distribution-program',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-distribution-program-vbZdCMlPVhwaaEU3cIhTcukNRqDWIp.header',
    pathname: 'wrap-vk-distribution-program.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-lottery-ESIYyLSl7xPCJ36QK1Si9I6rBhTcnA.header',
    pathname: 'wrap-vk-lottery.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-lottery-oEwNMCl3PsPe88c7KEqDpBTuZ92KQu',
    pathname: 'wrap-vk-lottery',
  },
];


export const LOTTERY_CACHE: ContractCache = {
  cachePath: '/dummy_bridge_cache',
  files: VERCEL_LOTTERY_CACHE.map(x => x.pathname),
  urls: VERCEL_LOTTERY_CACHE.map(x => x.url),
};

console.log('Lottery cache', LOTTERY_CACHE);
