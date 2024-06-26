import { ContractCache } from '@/lib/cache';
import { head, list } from '@vercel/blob';

const VERCEL_LOTTERY_CACHE = [
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-1024-JWgq7jmszGU36Sn9wmaZKw4s91PcgZ",
      "pathname": "lagrange-basis-fp-1024",
      "size": 187657,
      "uploadedAt": "2024-06-20T18:08:37.042Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-1024\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-1024-lsfL7dsEptdjHZyqXVLqOPa8AF7Erq.header",
      "pathname": "lagrange-basis-fp-1024.header",
      "size": 24,
      "uploadedAt": "2024-06-20T18:08:36.667Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-1024.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-16384-g1c6h9UCzVevP0F8HnIVdyb9jqNe8n.header",
      "pathname": "lagrange-basis-fp-16384.header",
      "size": 25,
      "uploadedAt": "2024-06-20T18:08:36.538Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-16384.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-16384-morc9NJiePdQIbyPg6wGsGWijfFDqq",
      "pathname": "lagrange-basis-fp-16384",
      "size": 3002151,
      "uploadedAt": "2024-06-20T18:09:00.403Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-16384\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-32768-2JCW3IsOv6tlu8haccYdsaXmCzRvWy.header",
      "pathname": "lagrange-basis-fp-32768.header",
      "size": 25,
      "uploadedAt": "2024-06-20T18:08:36.225Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-32768.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-32768-MNFXY3RjdHmqlKVjHu5gyoZ6kScpLq",
      "pathname": "lagrange-basis-fp-32768",
      "size": 6004084,
      "uploadedAt": "2024-06-20T18:10:08.665Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-32768\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-8192-0XhXxLfseQm6KIW79fhHSXzCtfuGVQ.header",
      "pathname": "lagrange-basis-fp-8192.header",
      "size": 24,
      "uploadedAt": "2024-06-20T18:08:36.681Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-8192.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fp-8192-ZlEROPdiSu0mnZ0FL5lOiQva6v4uH6",
      "pathname": "lagrange-basis-fp-8192",
      "size": 1501188,
      "uploadedAt": "2024-06-20T18:08:46.414Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fp-8192\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fq-16384-7YAdb6nzKSX7TYhaNsZS62u1Rs71MM",
      "pathname": "lagrange-basis-fq-16384",
      "size": 3002145,
      "uploadedAt": "2024-06-20T18:09:00.321Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fq-16384\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/lagrange-basis-fq-16384-DJbCAcwHQID0wXXmNMjsWXyseb3Nwn.header",
      "pathname": "lagrange-basis-fq-16384.header",
      "size": 25,
      "uploadedAt": "2024-06-20T18:08:36.687Z",
      "contentDisposition": "attachment; filename=\"lagrange-basis-fq-16384.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fp-65536-BF40IhxcT5FB2mQnp5nssnPGoQwbm1",
      "pathname": "srs-fp-65536",
      "size": 11090664,
      "uploadedAt": "2024-06-20T18:10:28.410Z",
      "contentDisposition": "attachment; filename=\"srs-fp-65536\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fp-65536-lPcF71aiigruPjJUteVdqJkFOiRHgv.header",
      "pathname": "srs-fp-65536.header",
      "size": 14,
      "uploadedAt": "2024-06-20T18:08:36.649Z",
      "contentDisposition": "attachment; filename=\"srs-fp-65536.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fq-32768-NadKnw4k6aPHomBIclpQthoS3wMjAk.header",
      "pathname": "srs-fq-32768.header",
      "size": 14,
      "uploadedAt": "2024-06-20T18:08:36.648Z",
      "contentDisposition": "attachment; filename=\"srs-fq-32768.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/srs-fq-32768-XlVMQvhwg25LU4SVgVfbUwTaMynPsx",
      "pathname": "srs-fq-32768",
      "size": 5545535,
      "uploadedAt": "2024-06-20T18:10:09.775Z",
      "contentDisposition": "attachment; filename=\"srs-fq-32768\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-addticket-AB3hG0aAR7PAhsqgi0o8NWsMLzYDdL",
      "pathname": "step-pk-distribution-program-addticket",
      "size": 116937500,
      "uploadedAt": "2024-06-20T18:11:39.586Z",
      "contentDisposition": "attachment; filename=\"step-pk-distribution-program-addticket\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-addticket-Ha5JzIFcvsJFy5tBPSc05DUH1x4LVA.header",
      "pathname": "step-pk-distribution-program-addticket.header",
      "size": 73,
      "uploadedAt": "2024-06-20T18:08:36.700Z",
      "contentDisposition": "attachment; filename=\"step-pk-distribution-program-addticket.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-init-6uXjo31CLKCy0b4UXse6PPubnb3x0V",
      "pathname": "step-pk-distribution-program-init",
      "size": 7508389,
      "uploadedAt": "2024-06-20T18:11:02.313Z",
      "contentDisposition": "attachment; filename=\"step-pk-distribution-program-init\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-distribution-program-init-qb2siGr0u5CItGij7rjaIgUJDKN5lg.header",
      "pathname": "step-pk-distribution-program-init.header",
      "size": 68,
      "uploadedAt": "2024-06-20T18:08:36.471Z",
      "contentDisposition": "attachment; filename=\"step-pk-distribution-program-init.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-buyticket-QHHdfMeur5oJtF36ApSir99xeBZzPl.header",
      "pathname": "step-pk-lottery-buyticket.header",
      "size": 60,
      "uploadedAt": "2024-06-20T18:08:36.636Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-buyticket.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-buyticket-uiMVLM5PVgJ7XRVqjxF6N3boL9JHtR",
      "pathname": "step-pk-lottery-buyticket",
      "size": 72236429,
      "uploadedAt": "2024-06-20T18:11:17.887Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-buyticket\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getcommisionforround-5fdl42snWHCPCkr5hfmErP5cHe4vng",
      "pathname": "step-pk-lottery-getcommisionforround",
      "size": 272197006,
      "uploadedAt": "2024-06-20T18:12:09.724Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-getcommisionforround\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getcommisionforround-ccBN5cgOd2ecWPzzmwsbfA7lEuKtvm.header",
      "pathname": "step-pk-lottery-getcommisionforround.header",
      "size": 71,
      "uploadedAt": "2024-06-20T18:08:36.446Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-getcommisionforround.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getreward-FQPRYcGQeBloM9a5vV1ibnqsMDBBAo.header",
      "pathname": "step-pk-lottery-getreward.header",
      "size": 60,
      "uploadedAt": "2024-06-20T18:08:36.482Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-getreward.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-getreward-sQyltg5oAZ3Ll6nSLtsvFVSBPVIcUv",
      "pathname": "step-pk-lottery-getreward",
      "size": 272534109,
      "uploadedAt": "2024-06-20T18:12:11.816Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-getreward\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-produceresult-0K2IHPdDhyepctJCahbGN4KA28HmDq",
      "pathname": "step-pk-lottery-produceresult",
      "size": 71069042,
      "uploadedAt": "2024-06-20T18:11:15.681Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-produceresult\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-produceresult-nFRnE032B4QcDnVFDe2hFJD44PyAWD.header",
      "pathname": "step-pk-lottery-produceresult.header",
      "size": 64,
      "uploadedAt": "2024-06-20T18:08:36.673Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-produceresult.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-refund-YyFCiRm47hTSL26HoEh3jP5mBoZm01",
      "pathname": "step-pk-lottery-refund",
      "size": 138457180,
      "uploadedAt": "2024-06-20T18:11:40.598Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-refund\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-pk-lottery-refund-l1jXHeqy4ZYMYgUdCqFXUhhLTkmeOQ.header",
      "pathname": "step-pk-lottery-refund.header",
      "size": 57,
      "uploadedAt": "2024-06-20T18:08:36.764Z",
      "contentDisposition": "attachment; filename=\"step-pk-lottery-refund.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-addticket-Uv9CYwsFJ4NLZVVajIdDvp6XQaISbh.header",
      "pathname": "step-vk-distribution-program-addticket.header",
      "size": 73,
      "uploadedAt": "2024-06-20T18:08:36.289Z",
      "contentDisposition": "attachment; filename=\"step-vk-distribution-program-addticket.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-addticket-bgmdWDk5VpAsmVtfzALd5zjCNaafad",
      "pathname": "step-vk-distribution-program-addticket",
      "size": 3460,
      "uploadedAt": "2024-06-20T18:08:36.687Z",
      "contentDisposition": "attachment; filename=\"step-vk-distribution-program-addticket\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-init-YD2ieHOtBSBzMSRZ7gFBiYvZeD18IS.header",
      "pathname": "step-vk-distribution-program-init.header",
      "size": 68,
      "uploadedAt": "2024-06-20T18:08:36.757Z",
      "contentDisposition": "attachment; filename=\"step-vk-distribution-program-init.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-distribution-program-init-iqjhpV6wYjF4lYrRS9osCtetrwGeSE",
      "pathname": "step-vk-distribution-program-init",
      "size": 3460,
      "uploadedAt": "2024-06-20T18:08:36.489Z",
      "contentDisposition": "attachment; filename=\"step-vk-distribution-program-init\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-buyticket-EDrNuBQznIKLYgUVC44bMRmcpqxMhF.header",
      "pathname": "step-vk-lottery-buyticket.header",
      "size": 60,
      "uploadedAt": "2024-06-20T18:08:36.595Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-buyticket.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-buyticket-o0NAiVcpSiNeoJUazU9OyhKeRhdxdV",
      "pathname": "step-vk-lottery-buyticket",
      "size": 4290,
      "uploadedAt": "2024-06-20T18:08:36.686Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-buyticket\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getcommisionforround-X3YE7bRdkTYf4DNF5p0ANHNtBo1bOO.header",
      "pathname": "step-vk-lottery-getcommisionforround.header",
      "size": 71,
      "uploadedAt": "2024-06-20T18:08:37.151Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-getcommisionforround.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getcommisionforround-ls7ToQq7ig1O9NMay0ynBpXZ6xonRj",
      "pathname": "step-vk-lottery-getcommisionforround",
      "size": 4138,
      "uploadedAt": "2024-06-20T18:08:36.568Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-getcommisionforround\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getreward-B8ld8GAbY9W7jD5Ik4TO1BKXrnpPs0.header",
      "pathname": "step-vk-lottery-getreward.header",
      "size": 60,
      "uploadedAt": "2024-06-20T18:08:36.703Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-getreward.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-getreward-KZGFKeNuWPoPEsjM7yxHNUa0rZqHoC",
      "pathname": "step-vk-lottery-getreward",
      "size": 4138,
      "uploadedAt": "2024-06-20T18:08:36.314Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-getreward\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-produceresult-IoqB0UEC42QeubhOuYTf8PSMUj9HQq.header",
      "pathname": "step-vk-lottery-produceresult.header",
      "size": 64,
      "uploadedAt": "2024-06-20T18:08:36.586Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-produceresult.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-produceresult-IsxYWS9rbb4j5CFhRk0HIIfb8Hud5x",
      "pathname": "step-vk-lottery-produceresult",
      "size": 4290,
      "uploadedAt": "2024-06-20T18:08:36.625Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-produceresult\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-refund-dVm9ixwa3uLhK1cCI7lS3BRgjenQIB.header",
      "pathname": "step-vk-lottery-refund.header",
      "size": 57,
      "uploadedAt": "2024-06-20T18:08:36.611Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-refund.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/step-vk-lottery-refund-poV4v2QZ7rDLhkYAbHgxfHu8KEh7Sj",
      "pathname": "step-vk-lottery-refund",
      "size": 4138,
      "uploadedAt": "2024-06-20T18:08:36.552Z",
      "contentDisposition": "attachment; filename=\"step-vk-lottery-refund\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-distribution-program-HWkol2nfdbolZUUvT9V9hK9os7pgj5",
      "pathname": "wrap-pk-distribution-program",
      "size": 116112036,
      "uploadedAt": "2024-06-20T18:11:39.496Z",
      "contentDisposition": "attachment; filename=\"wrap-pk-distribution-program\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-distribution-program-k35pPoEf5RIC7EveBApD5r7MQaBjr6.header",
      "pathname": "wrap-pk-distribution-program.header",
      "size": 61,
      "uploadedAt": "2024-06-20T18:08:36.854Z",
      "contentDisposition": "attachment; filename=\"wrap-pk-distribution-program.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-lottery-LNRUP4PWnDyZ3t8dp1zZdKnJZnotQp",
      "pathname": "wrap-pk-lottery",
      "size": 116319690,
      "uploadedAt": "2024-06-20T18:11:38.990Z",
      "contentDisposition": "attachment; filename=\"wrap-pk-lottery\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-pk-lottery-rpomymhxxM0iVOV5jQen4zxjsczEXn.header",
      "pathname": "wrap-pk-lottery.header",
      "size": 48,
      "uploadedAt": "2024-06-20T18:08:36.472Z",
      "contentDisposition": "attachment; filename=\"wrap-pk-lottery.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-distribution-program-1XrpuqAIrNsVZr0RBPDyEXJWswElrW",
      "pathname": "wrap-vk-distribution-program",
      "size": 10186,
      "uploadedAt": "2024-06-20T18:08:36.327Z",
      "contentDisposition": "attachment; filename=\"wrap-vk-distribution-program\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-distribution-program-89kEpJwdHnAfPiqsNaw7dwifazEKYg.header",
      "pathname": "wrap-vk-distribution-program.header",
      "size": 61,
      "uploadedAt": "2024-06-20T18:08:36.828Z",
      "contentDisposition": "attachment; filename=\"wrap-vk-distribution-program.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-lottery-bYG1ZgywYv81xpw1QurXnfaPOqzQLF.header",
      "pathname": "wrap-vk-lottery.header",
      "size": 48,
      "uploadedAt": "2024-06-20T18:08:36.270Z",
      "contentDisposition": "attachment; filename=\"wrap-vk-lottery.header\""
  },
  {
      "url": "https://li4vhe2kc60netyr.public.blob.vercel-storage.com/wrap-vk-lottery-cB7C29j1CcZJo4MQ73ZwrmdSZzGZsl",
      "pathname": "wrap-vk-lottery",
      "size": 10186,
      "uploadedAt": "2024-06-20T18:08:36.252Z",
      "contentDisposition": "attachment; filename=\"wrap-vk-lottery\""
  }
];

export const LOTTERY_CACHE: ContractCache = {
  cachePath: '/dummy_bridge_cache',
  files: VERCEL_LOTTERY_CACHE.map((x) => x.pathname),
<<<<<<< HEAD
  urls: VERCEL_LOTTERY_CACHE.map((x) => `/lottery_cache/${x.pathname}`),
=======
  urls: VERCEL_LOTTERY_CACHE.map((x) => x.url),
>>>>>>> origin/neogar-develop
};

console.log('Lottery cache', LOTTERY_CACHE);
