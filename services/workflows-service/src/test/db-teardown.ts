export async function teardown() {
  if (global.__CONTAINER__) {
    await global.__CONTAINER__.stop();
  }
}

module.exports = teardown;
