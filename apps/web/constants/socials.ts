import githubImg from '@/public/image/socials/github.svg';
import twitterImg from '@/public/image/socials/twitter.svg';
import mediumImg from '@/public/image/socials/medium.svg';

export const SOCIALS = [
  {
    id: 'github',
    name: 'Github',
    link: 'https://github.com/ZkNoid',
    image: githubImg,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    link: 'https://twitter.com/ZkNoid',
    image: twitterImg,
  },
  {
    id: 'medium',
    name: 'Medium',
    link: 'https://medium.com/@zknoid',
    image: mediumImg,
  },
];

export const MOBILE_HEADER_SOCIALS = SOCIALS.filter(
  (item) => item.id === 'github' || item.id === 'twitter'
);
