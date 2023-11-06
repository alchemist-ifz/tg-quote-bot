export default async function cmdSetMainPack(ctx) {

  try {

    ctx.log.info("/setmainpack call");

    if (!ctx.isAdmin) {
      return;
    }

    const msg = ctx.update.message;

    const extra = {
      reply_to_message_id: msg.message_id,
    };

    let setName = msg.text.slice(msg.entities[0].length + 1).toLowerCase();

    if (typeof setName !== "string" || setName === "") {
      return await ctx.reply(`⚠️ Укажите имя основного набора.`, extra);
    }

    setName += `_by_${ctx.botInfo.username}`;

    if (!ctx.state.sets[setName]) {
      return await ctx.reply(`⚠️ Такого набора не существует.`, extra);
    }

    ctx.state.mainSet = setName;

    return await ctx.reply(`✅ Основной набор изменён: https://t.me/addstickers/${setName}.`, extra);

  } catch (err) {

    ctx.log.error({ err, desc: "/setmainpack", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось установить набор по умолчанию.`, extra);

  }

}
