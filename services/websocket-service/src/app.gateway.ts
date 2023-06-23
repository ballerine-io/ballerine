import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({ transport: ['websocket'] })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server | undefined;

  private logger = new Logger('AppGateway');

  handleConnection() {
    this.logger.log('New client connected');
  }

  handleDisconnect() {
    this.logger.log('Client disconnected');
  }

  broadcast(event: string, message: string) {
    const broadCastMessage = JSON.stringify(message);
    if (this.server) {
      for (const client of this.server.clients) {
        client.send(event + broadCastMessage);
      }
    }
  }
}
