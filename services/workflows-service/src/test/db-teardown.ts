export async function teardown() {
  if (!global.__DB_CONTAINER__) return

  await global.__DB_CONTAINER__.stop();
}

module.exports = teardown;
