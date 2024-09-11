import MailImage from '@/public/image/contacts/mail.svg';
import TwitterImage from '@/public/image/socials/twitter.svg';
import TelegramImage from '@/public/image/socials/telegram.svg';
import DiscordImage from '@/public/image/socials/discord.svg';

export const CONTACTS = [
  {
    id: 'email',
    image: MailImage,
    link: 'mailto:support@zknoid.io',
    label: 'support@zknoid.io',
  },
  {
    id: 'twitter',
    image: TwitterImage,
    link: 'https://twitter.com/ZkNoid',
    label: 'ZkNoid on twitter',
  },
  {
    id: 'telegram',
    image: TelegramImage,
    link: 'https://t.me/ZkNoid',
    label: 'ZkNoid telegram channel',
  },
  {
    id: 'discord',
    image: DiscordImage,
    link: 'https://discord.gg/hndRCZwQnb',
    label: 'ZkNoid discord server',
  },
];
