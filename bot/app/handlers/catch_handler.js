export default async function catchHandler(err, ctx) {

  ctx.log.error({
    err,
    desc: "bot.catch() handler",
    update: ctx.update,
  });

  try {

    if (!ctx.queue.errors[err.message]) {
      ctx.queue.errors[err.message] = 0;
    }

    ctx.queue.errors[err.message]++;

  } catch (err) {

    ctx.log.error({
      err,
      desc: "failed to send message to owner",
      owner: ctx.config.owner_id,
    });

  }

}
