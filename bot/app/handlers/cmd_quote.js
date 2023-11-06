const params = {
  "type": "quote",
  "format": "webp",
  "backgroundColor": "//#292232",
  "width": 512,
  "height": 768,
  "scale": 2,
  "messages": [],
  "emojiBrand": "apple",
};

import { updateMessages } from "../utils/index.js";
import generate from "../generator/generate.js";

export default async function cmdQuote(ctx) {

  try {

    ctx.log.info("/q call");

    const msg = ctx.update.message;

    const extra = {
      reply_to_message_id: msg.message_id,
    };

    const arg = msg.text.slice(msg.entities[0].length + 1).trim();
    const numMsgs = arg ? parseInt(arg) : 1;

    if (arg && !Number.isFinite(numMsgs)) {
      return await ctx.reply(`⚠️ Укажите количество сообщений, из которых вы хотите сделать стикер.`, extra);
    }

    if (!msg.reply_to_message || !msg.reply_to_message.text) {
      return await ctx.reply(`⚠️ Укажите текстовое сообщение, из которого вы хотите сделать стикер.`, extra);
    }

    const msgs = [msg.reply_to_message];

    const updatedMsgs = await updateMessages(ctx, msgs);

    params.messages = updatedMsgs;
    params.botToken = ctx.config.BOT_TOKEN;

    const result = await generate(params);

    return await ctx.replyWithSticker({ source: Buffer.from(result.image, "base64") }, {
      emoji: "😼",
      allow_sending_without_reply: true,
      ...extra,
    });

  } catch (err) {

    ctx.log.error({ err, desc: "/q", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось создать стикер.`, extra);

  }

}
