import PhoneImage from '@/public/image/contacts/phone.svg';
import MailImage from '@/public/image/contacts/mail.svg';
import TwitterImage from '@/public/image/socials/twitter.svg';
import TelegramImage from '@/public/image/socials/telegram.svg';
import DiscordImage from '@/public/image/socials/discord.svg';

export const CONTACTS = [
  {
    id: 'phone',
    image: PhoneImage,
    link: 'tel:+9059634715',
    label: '+905 963 47 15',
  },
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
    label: '@ZkNoid',
  },
  {
    id: 'telegram',
    image: TelegramImage,
    link: 'https://t.me/ZkNoid',
    label: '@ZkNoid',
  },
  {
    id: 'discord',
    image: DiscordImage,
    link: '#',
    label: '@ZkNoid_discord',
  },
];
