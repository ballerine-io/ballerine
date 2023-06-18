import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { env } from '@/env';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  void app.listen(env.PORT);
  console.log(`Listening on port ${env.PORT}`);

  return app;
}

module.exports = main();
