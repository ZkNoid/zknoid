import githubImg from '@/public/image/socials/github.svg';
import githubImgWhite from '@/public/image/socials/github-white.svg';
import twitterImg from '@/public/image/socials/twitter.svg';
import twitterImgWhite from '@/public/image/socials/twitter-white.svg';
import mediumImg from '@/public/image/socials/medium.svg';
import mediumImgWhite from '@/public/image/socials/medium-white.svg';
import TelegramImage from '@/public/image/socials/telegram.svg';
import TelegramImageWhite from '@/public/image/socials/telegram-white.svg';
import DiscordImage from '@/public/image/socials/discord.svg';
import DiscordImageWhite from '@/public/image/socials/discord-white.svg';

export const SOCIALS = [
  {
    id: 'github',
    name: 'Github',
    link: 'https://github.com/ZkNoid/zknoid',
    image: githubImg,
    whiteImage: githubImgWhite,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    link: 'https://twitter.com/ZkNoid',
    image: twitterImg,
    whiteImage: twitterImgWhite,
  },
  {
    id: 'medium',
    name: 'Medium',
    link: 'https://medium.com/@zknoid',
    image: mediumImg,
    whiteImage: mediumImgWhite,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    link: 'https://t.me/ZkNoid',
    image: TelegramImage,
    whiteImage: TelegramImageWhite,
  },
  {
    id: 'discord',
    name: 'Discord',
    link: 'https://discord.gg/hndRCZwQnb',
    image: DiscordImage,
    whiteImage: DiscordImageWhite,
  },
];

export const MOBILE_HEADER_SOCIALS = SOCIALS.filter(
  (item) => item.id === 'github' || item.id === 'twitter'
);
