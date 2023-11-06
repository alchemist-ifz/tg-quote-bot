export default async function cmdNewPack(ctx) {

  try {

    ctx.log.info("/newpack call");

    if (!ctx.isAdmin) {
      return;
    }

    const msg = ctx.update.message;

    const extra = {
      reply_to_message_id: msg.message_id,
    };

    let setName = msg.text.slice(msg.entities[0].length + 1).toLowerCase();

    if (typeof setName !== "string" || setName === "") {
      return await ctx.reply(`⚠️ Укажите имя для нового набора.`, extra);
    }

    setName += `_by_${ctx.botInfo.username}`;

    if (ctx.state.sets[setName]) {
      return await ctx.reply(`⚠️ Такой набор уже существует.`, extra);
    }

    if (!setName.match(/^[a-z]/i)) {
      return await ctx.reply(`⚠️ Имя набора должно начинаться с латинской буквы.`, extra);
    }

    await ctx.telegram.createNewStickerSet(ctx.config.owner_id, setName, `Created by @${ctx.botInfo.username}`, {
      png_sticker: { source: './assets/sticker_placeholder.webp' },
      emojis: '😼'
    });

    ctx.state.sets[setName] = true;

    if (ctx.state.mainSet === "") {
      ctx.state.mainSet = setName;
    }

    return await ctx.reply(`✅ Набор создан: https://t.me/addstickers/${setName}.`, extra);

  } catch (err) {

    ctx.log.error({ err, desc: "/newpack", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось создать набор.`, extra);

  }

}
