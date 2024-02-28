import githubImg from '@/public/image/socials/github.svg';
import githubImgWhite from '@/public/image/socials/github-white.svg';
import twitterImg from '@/public/image/socials/twitter.svg';
import twitterImgWhite from '@/public/image/socials/twitter-white.svg';
import mediumImg from '@/public/image/socials/medium.svg';
import mediumImgWhite from '@/public/image/socials/medium-white.svg';

export const SOCIALS = [
  {
    id: 'github',
    name: 'Github',
    link: 'https://github.com/ZkNoid',
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
];

export const MOBILE_HEADER_SOCIALS = SOCIALS.filter(
  (item) => item.id === 'github' || item.id === 'twitter'
);
