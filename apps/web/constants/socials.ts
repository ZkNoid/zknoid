export const SOCIALS = [
    {
        id: 'github',
        name: 'Github',
        link: 'https://github.com/ZkNoid',
        image: '/image/socials/github.svg',
    },
    {
        id: 'twitter',
        name: 'Twitter',
        link: 'https://twitter.com/ZkNoid',
        image: '/image/socials/twitter.svg',
    },
    {
        id: 'medium',
        name: 'Medium',
        link: 'https://medium.com/@zknoid',
        image: '/image/socials/medium.svg',
    },
];

export const MOBILE_HEADER_SOCIALS = SOCIALS.filter(
    item => item.id === 'github' || item.id === 'twitter'
)