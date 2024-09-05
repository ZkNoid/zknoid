import MinaTokenSvg from '@/public/image/tokens/mina.svg';

export type ZkNoidAsset = {
  name: string;
  ticker: string;
  icon: any | undefined;
  decimals: number;
};

export const L1_ASSETS: Record<string, ZkNoidAsset> = {
  Mina: {
    name: 'Mina',
    ticker: '$MINA',
    icon: '/image/tokens/mina.svg',
    decimals: 9,
  },
  ZkNoid: {
    name: 'ZkNoid',
    ticker: '$ZkNoid',
    icon: '/image/tokens/znakes.svg',
    decimals: 9,
  },
};

export const ALL_ZKNOID_L1_ASSETS = [L1_ASSETS.Mina, L1_ASSETS.ZkNoid];

export const L2_ASSET: ZkNoidAsset = {
  name: 'Znakes',
  ticker: '$znakes',
  icon: '/image/tokens/znakes.svg',
  decimals: 9,
};
