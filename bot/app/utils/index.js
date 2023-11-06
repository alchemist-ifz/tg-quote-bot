import process from "node:process";

export function humanReadableSize(size) {

  const suffixes = ['b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Zb'];

  let suffix = 0;
  let limit = suffixes.length - 1;

  while (size >= 1024 && suffix < limit) {
    size /= 1024;
    suffix++;
  }

  return size.toFixed(2) + ' ' + suffixes[suffix];

}

export function memoryUsage() {

  return process.memoryUsage();

}

export function convertMsg(msg) {

  let userId = msg.from.id;
  let firstName = msg.from.first_name;
  let lastName = msg.from.last_name || "";

  if (msg.forward_sender_name) {
    userId = 0;
    firstName = msg.forward_sender_name;
    lastName = "";
  }

  if (msg.forward_from) {
    userId = msg.forward_from.id;
    firstName = msg.forward_from.first_name;
    lastName = msg.forward_from.last_name || "";
  }

  if (msg.forward_from_chat) {
    userId = msg.forward_from_chat.id;
    firstName = msg.forward_from_chat.title || "";
    lastName = "";
  }

  const userName = firstName + (lastName ? ` ${lastName}` : "");

  const result = {
    entities: [],
    chatId: msg.chat.id,
    avatar: true,
    from: {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      language_code: msg.from.language_code || "",
      title: userName, // TODO?
      photo: {},
      type: msg.chat.type,
      name: userName,
    },
    text: msg.text,
    replyMessage: {},
  };

  return result;

}

export async function updateMessages(ctx, msgs) {

  const result = [];

  for (let i = 0; i < msgs.length; i++) {

    const msg = msgs[i];

    if (!ctx.cache.avatars[msg.from.id]) {

      ctx.cache.avatars[msg.from.id] = {
        time: 0,
        photo: {},
        avatar: false,
      };

    }

    if ((Date.now() - ctx.cache.avatars[msg.from.id].time) < 3600000) {

      const photos = await ctx.telegram.getUserProfilePhotos(msg.from.id, 0, 1);

      if (photos.photos.length > 0) {

        const smallFile = photos.photos[0];
        const bigFile = photos.photos.pop();

        ctx.cache.avatars[msg.from.id].avatar = true;

        ctx.cache.avatars[msg.from.id].photo = {
          small_file_id: smallFile.file_id,
          small_file_unique_id: smallFile.file_unique_id,
          big_file_id: bigFile.file_id,
          big_file_unique_id: bigFile.file_unique_id,
        };

      }

    }

    msg.from.photo = ctx.cache.avatars[msg.from.id].photo;
    msg.avatar = ctx.cache.avatars[msg.from.id].avatar;

    result.push(convertMsg(msg));

  }

  return result;

}

export async function errQueueHanlder({ context: ctx, telegram }) {

  if ((Date.now() - ctx.queue.sendTime) < 60000) {
    return;
  }

  const res = [];

  for (const errMsg in ctx.queue.errors) {
    res.push(`❌ ${errMsg}: ${ctx.queue.errors[errMsg]}`);
  }

  if (res.length === 0) {
    return;
  }

  await telegram.sendMessage(ctx.config.owner_id, res.join("\n"));

  ctx.queue.errors = {};
  ctx.queue.sendTime = Date.now();

}
