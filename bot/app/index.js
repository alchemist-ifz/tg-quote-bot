/* ========================================================================== */
/*  Internal modules                                                          */
/* ========================================================================== */
import fs from "node:fs";

/* ========================================================================== */
/*  External modules                                                          */
/* ========================================================================== */
import { Telegraf } from "telegraf";
import pino from "pino";

/* ========================================================================== */
/*  App modules                                                               */
/* ========================================================================== */
import config from "./config.js";
import handlers from "./handlers/index.js";
import { errQueueHanlder } from "./utils/index.js";

/* ========================================================================== */
/*  Main                                                                      */
/* ========================================================================== */
async function main() {
  //
  const log = pino({
    level: "trace", // fatal, error, warn, info, debug, trace, silent
  }, pino.multistream([{
    level: "trace",
    stream: fs.createWriteStream("./logs/main.log", { flags: "a" }),
  }, {
    level: "error",
    stream: fs.createWriteStream("./logs/errors.log", { flags: "a" }),
  }]));

  const bot = new Telegraf(config.BOT_TOKEN);

  bot.context.config = config;
  bot.context.log = log;

  bot.context.botInfo = await bot.telegram.getMe();
  bot.context.cache = { avatars: {} };
  bot.context.state = { mainSet: "", sets: {} };
  bot.context.queue = {
    sendTime: 0,
    errors: {},
  };

  const stateFilePath = "state.json";

  if (fs.existsSync(stateFilePath)) {
    bot.context.state = JSON.parse(fs.readFileSync(stateFilePath));
  }

  for (const setName in bot.context.state.sets) {

    try {
      await bot.telegram.getStickerSet(setName);
    } catch (err) {
      log.warn(`StickerSet ${setName} not found.`);
      delete bot.context.state.sets[setName];
    }

  }

  bot.use(async (ctx, next) => {

    ctx.log.debug({ desc: "request", update: ctx.update });

    if (!ctx.update.message) {
      return;
    }

    const msg = ctx.update.message;

    if (!config.active_chats[msg.chat.id]) {
      return;
    }

    if (ctx.config.admins[msg.from.id]) {
      ctx.isAdmin = true;
    }

    if (msg.from.id === ctx.config.owner_id) {
      ctx.isOwner = true;
    }

    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    ctx.log.info(`Response time: ${ms} ms`);

  });

  bot.command("start", handlers.cmdHelp);
  bot.command("help", handlers.cmdHelp);

  bot.command("q", handlers.cmdQuote);
  bot.command("add", handlers.cmdAdd);

  bot.command("listpack", handlers.cmdListPack);

  bot.command("del", handlers.cmdDel);
  bot.command("newpack", handlers.cmdNewPack);
  bot.command("setmainpack", handlers.cmdSetMainPack);
  bot.command("report", handlers.cmdReport);
  bot.command("test_error", handlers.cmdTestError);

  bot.catch(handlers.catchHandler);

  const errQueueHanlderTimeout = setInterval(() => {
    errQueueHanlder(bot);
  }, 5000);

  function closeHandler(signal) {
    clearInterval(errQueueHanlderTimeout);
    bot.stop(signal);
    fs.writeFileSync(stateFilePath, JSON.stringify(bot.context.state, null, 2));
    log.info(`Stopped with a signal ${signal}`);
  }

  process.once('SIGINT', () => closeHandler('SIGINT'));
  process.once('SIGTERM', () => closeHandler('SIGTERM'));

  bot.launch();

}

main();
