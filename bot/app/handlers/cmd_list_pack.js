export default async function cmdListPack(ctx) {

  try {

    ctx.log.info("/listpack call");

    const msg = ctx.update.message;

    const extra = {
      reply_to_message_id: msg.message_id,
    };

    const list = [];

    for (const setName in ctx.state.sets) {
      list.push(`https://t.me/addstickers/${setName}`);
    }

    if (list.length > 0) {
      return await ctx.reply(list.join("\n"), extra);
    }

    return await ctx.reply("⚠️ Не найдено ни одного набора стикеров.", extra);

  } catch (err) {

    ctx.log.error({ err, desc: "/listpack", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось получить список наборов стикеров.`, extra);

  }

}
