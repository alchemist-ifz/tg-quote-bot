export default async function cmdHelp(ctx) {

  try {

    ctx.log.info("/help call");

    return await ctx.reply([
      "Основные команды:",
      "/q - создать стикер",
      "/add - добавить стикер в основной набор",
      "",
      "Вспомогательные команды:",
      "/listpack - показать список наборов стикеров",
      "",
      "Команды для администраторов:",
      "/del - удалить стикер из основного набора",
      "/newpack - создать набор стикеров",
      "/setmainpack - установить набор стикеров как основной",
      "/report - получить отчёт о состоянии бота",
    ].join("\n"));

  } catch (err) {

    ctx.log.error({ err, desc: "/help", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось получить справку.`, extra);

  }

}
