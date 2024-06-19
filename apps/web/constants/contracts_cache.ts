import { ContractCache } from '@/lib/cache';
import { head, list } from '@vercel/blob';

const VERCEL_LOTTERY_CACHE = [
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-1024-B1RKpGFymuUsIaJUNxkEh8VYh6MXB4.header',
    pathname: 'lagrange-basis-fp-1024.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-1024-a6dXhBvd7x1Z2eyanNKq72ripPwLVq',
    pathname: 'lagrange-basis-fp-1024',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-16384-0kSxyIK0rmGdpXKYnRLPRCQIV0krzm',
    pathname: 'lagrange-basis-fp-16384',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-16384-v6W2VaRoIKAfMdvG13OrpJ8B30mi5K.header',
    pathname: 'lagrange-basis-fp-16384.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-8192-9H6c2aMsZmwh6JsQzgZJw2kWCIasmz',
    pathname: 'lagrange-basis-fp-8192',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-8192-bSAaEvE1Upu35W7vVwyne78NDEvYJD.header',
    pathname: 'lagrange-basis-fp-8192.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fq-16384-rnYhYR1WtdB8kW6yFvV8pAbfWtAlcP.header',
    pathname: 'lagrange-basis-fq-16384.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fq-16384-xdPqRSPJ7925Aq26BjHfq2pQoVJq7t',
    pathname: 'lagrange-basis-fq-16384',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fp-65536-C5VgRfxJFzp2p4cq6E6OMpX3dulfn9',
    pathname: 'srs-fp-65536',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fp-65536-lflkUH1jqlLa8z27NUkyFY692GaRF1.header',
    pathname: 'srs-fp-65536.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fq-32768-Abl06ak5M44KurIKxJHEJ1X0tov5yS',
    pathname: 'srs-fq-32768',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fq-32768-aPrY1nRv1rN1Qa0YGaBqmHl7xDFz9c.header',
    pathname: 'srs-fq-32768.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-addticket-BWpnBCQtHAG6sYFHXtIHYWzKtzpz40.header',
    pathname: 'step-pk-distribution-program-addticket.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-addticket-TKtMyI4VYtgMN6BSfnVdO6JJLFzDuU',
    pathname: 'step-pk-distribution-program-addticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-init-2dZ4nfosQxGGaKTK75LY0PrOmB29GS.header',
    pathname: 'step-pk-distribution-program-init.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-init-mhq6EQ9slAyyeW091y24WqW3BK6A0m',
    pathname: 'step-pk-distribution-program-init',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-buyticket-6JPL4yrglvhNzapgjHRKDbdMJcxkhN.header',
    pathname: 'step-pk-lottery-buyticket.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-buyticket-rzoVPXd5pgrofTjBLfFpp8AKJALkWT',
    pathname: 'step-pk-lottery-buyticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getcommisionforround-LzKIgqeWOCZ9dJeQcN3UhpeXpRuFq1',
    pathname: 'step-pk-lottery-getcommisionforround',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getcommisionforround-aFNfg4k4leaI6QAHH7TD8GH41ZWK9S.header',
    pathname: 'step-pk-lottery-getcommisionforround.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getreward-ZofiU54AnfJ8InXixKGMzoJXyKH3qB',
    pathname: 'step-pk-lottery-getreward',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getreward-jrNf1NqIrEHFIfzdpGKO9NXlwqLIEw.header',
    pathname: 'step-pk-lottery-getreward.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-produceresult-BWoCOXpjxPKf1CmtEZhuzj7Ev6yfuV.header',
    pathname: 'step-pk-lottery-produceresult.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-produceresult-Dq0i16QiAb3NxfwQYTY2JOjhmwJnOv',
    pathname: 'step-pk-lottery-produceresult',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-refund-3R8oc8pg0rTQ7IqS3QiNlPRen12zWk.header',
    pathname: 'step-pk-lottery-refund.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-refund-kFbfAc8KFsbSLekZasWWPfyOUi9oSL',
    pathname: 'step-pk-lottery-refund',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-addticket-Ffivg25sexZQSXqRoYlhPm5ZXaTVbj.header',
    pathname: 'step-vk-distribution-program-addticket.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-addticket-kbyrdoqavTDgQYqvkaYh9jBQKNDFlK',
    pathname: 'step-vk-distribution-program-addticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-init-2d63fI6Jpw56efwNSmy7LRymV0BXQZ.header',
    pathname: 'step-vk-distribution-program-init.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-init-AiL67dehm6Oo5tOhVxWa5oSxRpgRxx',
    pathname: 'step-vk-distribution-program-init',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-buyticket-mpPwcEPTsSWkk4PNT9qjdCSdSe4E6T',
    pathname: 'step-vk-lottery-buyticket',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-buyticket-sLd0VU0hH0bkW6uIAJtAurSm5oHvgt.header',
    pathname: 'step-vk-lottery-buyticket.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getcommisionforround-VayFNL3uypXANtcih2zOgcD0Xr7jbR',
    pathname: 'step-vk-lottery-getcommisionforround',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getcommisionforround-sI531LeY38dpHtjnzUVSjud7z43fTg.header',
    pathname: 'step-vk-lottery-getcommisionforround.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getreward-9wdhu1qByKPFHPkXo9mVHoEs0yoS2G.header',
    pathname: 'step-vk-lottery-getreward.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getreward-prExtPJVm1kvxblXunGVirIubcSbCj',
    pathname: 'step-vk-lottery-getreward',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-produceresult-QkOpKNLQPROzjcx7pORUuTLgsDiWHN',
    pathname: 'step-vk-lottery-produceresult',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-produceresult-ghM5oZAAWxZZS53x2d9zmR548qPVUJ.header',
    pathname: 'step-vk-lottery-produceresult.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-refund-diJP5IjwOZB7PN34mpaLPN5QMXR9Ri',
    pathname: 'step-vk-lottery-refund',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-refund-zqq5kb6Uf6bRf7U3oTa1Bev1OreFrj.header',
    pathname: 'step-vk-lottery-refund.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-distribution-program-qyopDPutVzGljFc0E0rs6ECaSotqW7',
    pathname: 'wrap-pk-distribution-program',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-distribution-program-wql59X9LOIlAQdzLO5FskkYLhfwdDp.header',
    pathname: 'wrap-pk-distribution-program.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-lottery-6ubPUh9xfRWmZ8CFTCOGIuVMrKfPq5',
    pathname: 'wrap-pk-lottery',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-lottery-EhHVDsb6pTlDlXf0LFaT3frFl2yBn3.header',
    pathname: 'wrap-pk-lottery.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-distribution-program-BDBm53HVhsU8D3cEFKtLpOdAOYqAj4',
    pathname: 'wrap-vk-distribution-program',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-distribution-program-VwNfgOKPU0NZMfLg8l4Vjf9fWQ96ho.header',
    pathname: 'wrap-vk-distribution-program.header',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-lottery-nFmAPCy5tyykJ1sdgGtzhvXG12cuZG',
    pathname: 'wrap-vk-lottery',
  },
  {
    url: 'https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-lottery-reCHte6SIucFEE6zgdOET6AYugy1xe.header',
    pathname: 'wrap-vk-lottery.header',
  },
];

export const LOTTERY_CACHE: ContractCache = {
  cachePath: '/dummy_bridge_cache',
  files: VERCEL_LOTTERY_CACHE.map((x) => x.pathname),
  urls: VERCEL_LOTTERY_CACHE.map((x) => x.url),
};

console.log('Lottery cache', LOTTERY_CACHE);
