import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class WebhookHttpService extends HttpService {}
