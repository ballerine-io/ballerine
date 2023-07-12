import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'ws';
import Keygrip from 'keygrip';
import { env } from '@/env';

@WebSocketGateway({
  cors: true,
  transport: ['websocket'],
  verifyClient: (info: any, cb: (boolean) => void) => {
    const isUserAuthenticated = AppGateway.verifyToken(info.req.headers.cookie);
    cb(isUserAuthenticated);
  },
})
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
    if (this.server) {
      for (const client of this.server.clients) {
        client.send(message);
      }
    }
  }

  static verifyToken(cookieInBase64: string): boolean {
    const rawCookie = AppGateway.extractValueByKeyFromCookie(cookieInBase64, 'session');

    if (rawCookie.length === 0) return false;

    const decodedSession = Buffer.from(rawCookie, 'base64');
    const decodedSessionObj = JSON.parse(decodedSession.toString('utf8'));

    if (
      Object.keys(decodedSessionObj).includes('passport') &&
      Object.keys(decodedSessionObj['passport']).includes('user')
    ) {
      const providedSignature = AppGateway.extractValueByKeyFromCookie(
        cookieInBase64,
        'session.sig',
      );
      if (providedSignature.length === 0) return false;

      const keygrip = new Keygrip([env.SESSION_SECRET]);
      const validSignature = keygrip.sign('session=' + rawCookie);

      return providedSignature === validSignature;
    }
    return false;
  }

  static extractValueByKeyFromCookie(cookie: string, key: string): string {
    if (cookie.includes(key)) {
      const keyValue = cookie.split('; ').find((cookie: string) => cookie.startsWith(key));
      if (keyValue) {
        const firstEqualSignIndex = keyValue.indexOf('=');
        return keyValue.substring(firstEqualSignIndex + 1);
      }
    }
    return '';
  }
}
