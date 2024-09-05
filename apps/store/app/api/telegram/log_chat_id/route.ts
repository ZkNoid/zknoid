import TelegramBot from 'node-telegram-bot-api';

export async function GET(request: Request) {
  if (process.env.LOG_MESSAGES) {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
      polling: true,
    });

    bot.on('message', (msg) => {
      console.log(msg);
      const chatId = msg.chat.id;

      // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, `Received your message ${chatId}`);
    });
  }

  return Response.json({
    status: 'ok',
  });
}
