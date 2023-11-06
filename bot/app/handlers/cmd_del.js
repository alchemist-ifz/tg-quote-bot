export default async function cmdDel(ctx) {

  try {

    ctx.log.info("/del call");

    if (!ctx.isAdmin) {
      return;
    }

    const msg = ctx.update.message;

    const extra = {
      reply_to_message_id: msg.message_id,
    };

    if (!ctx.state.mainSet) {
      return await ctx.reply(`⚠️ Отустствует основной набор стикеров.`, extra);
    }

    const setName = ctx.state.mainSet;

    if (msg.reply_to_message && msg.reply_to_message.sticker) {

      const { sticker } = msg.reply_to_message;

      const stickerSet = await ctx.telegram.getStickerSet(setName);

      const isFirstSticker = stickerSet.stickers[0].file_id === sticker.file_id;

      if (ctx.config.protect_kitten && isFirstSticker) {
        return await ctx.reply(`⚠️ Удалять котика нельзя. 😼`, extra);
      }

      const stickerInSet = stickerSet.stickers
        .filter(s => s.file_id === sticker.file_id).length === 0;

      if (stickerInSet) {
        return await ctx.reply(`⚠️ Такого стикера нет в наборе.`, extra);
      }

      await ctx.telegram.deleteStickerFromSet(sticker.file_id);

      return await ctx.reply(`✅ Стикер удалён.`, extra);

    }

    const arg = msg.text.slice(msg.entities[0].length + 1).trim();
    const position = arg ? parseInt(arg) : 0;

    if (!arg || !Number.isFinite(position)) {
      return await ctx.reply(`⚠️ Укажите номер стикера, который вы хотите удалить (начиная с 0).`, extra);
    }

    if (ctx.config.protect_kitten && position === 0) {
      return await ctx.reply(`⚠️ Удалять котика нельзя. 😼`, extra);
    }

    const stickerSet = await ctx.telegram.getStickerSet(setName);

    if (!stickerSet.stickers[position]) {
      return await ctx.reply(`⚠️ Стикера с таким номером не существует.`, extra);
    }

    const fileId = stickerSet.stickers[position].file_id;
    await ctx.telegram.deleteStickerFromSet(fileId);

    return await ctx.reply(`✅ Стикер удалён.`, extra);

  } catch (err) {

    ctx.log.error({ err, desc: "/del", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось удалить стикер из набора.`, extra);

  }

}
