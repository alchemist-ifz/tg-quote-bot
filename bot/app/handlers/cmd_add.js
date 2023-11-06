export default async function cmdAdd(ctx) {

  try {

    ctx.log.info("/add call");

    const msg = ctx.update.message;

    const extra = {
      reply_to_message_id: msg.message_id,
    };

    if (!ctx.state.mainSet) {
      return await ctx.reply(`⚠️ Отустствует основной набор стикеров.`, extra);
    }

    const setName = ctx.state.mainSet;

    if (!msg.reply_to_message || !msg.reply_to_message.sticker) {
      return await ctx.reply(`⚠️ Укажите стикер, который хотите добавить в набор.`, extra);
    }

    const { sticker } = msg.reply_to_message;

    if (sticker.is_animated || sticker.is_video) {
      return await ctx.reply(`⚠️ В набор можно добавлять только статичные стикеры.`, extra);
    }

    await ctx.telegram.addStickerToSet(ctx.config.owner_id, setName, {
      png_sticker: msg.reply_to_message.sticker.file_id,
      emojis: '😼',
    });

    return await ctx.reply(`✅ Стикер добавлен.`, extra);

  } catch (err) {

    ctx.log.error({ err, desc: "/add", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось добавить стикер в набор.`, extra);

  }

}
