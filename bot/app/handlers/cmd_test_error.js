export default async function cmdTestError(ctx) {

  ctx.log.info("/test_error call");

  if (!ctx.isAdmin) {
    return;
  }

  throw new Error("TEST ERROR");

}
