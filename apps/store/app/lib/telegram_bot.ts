import TelegramBot from 'node-telegram-bot-api';

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!);

export default telegramBot;
