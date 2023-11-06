import fs from "node:fs";

import { humanReadableSize, memoryUsage } from "../utils/index.js";

export default async function cmdReport(ctx) {

  try {

    ctx.log.info("/report call");

    if (!ctx.isAdmin) {
      return;
    }

    const msg = ctx.update.message;

    const extra = {
      reply_to_message_id: msg.message_id,
    };

    const rows = [];

    // date
    const date = new Date();
    date.setHours(date.getHours() + 3);

    rows.push(`Date: ${date.toISOString().replace("T", " ").slice(0, -5)} [MSK]`);
    rows.push(``);

    // logs
    const errLogSize = fs.lstatSync("./logs/errors.log").size;
    const mainLogSize = fs.lstatSync("./logs/main.log").size;

    rows.push(`Logs: main - ${humanReadableSize(mainLogSize)}, errors - ${humanReadableSize(errLogSize)}`);

    // memory usage
    const mem = memoryUsage();

    rows.push(`Memory: ${humanReadableSize(mem.rss)}`);

    return await ctx.reply(rows.join("\n"), extra);

  } catch (err) {

    ctx.log.error({ err, desc: "/report", update: ctx.update });

    const extra = {
      reply_to_message_id: ctx.update.message.message_id,
    };

    return await ctx.reply(`❌ Не удалось собрать отчёт.`, extra);

  }

}
