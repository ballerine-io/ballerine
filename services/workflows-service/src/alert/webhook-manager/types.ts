export interface IWebhookEventData<T> {
  eventName: string;
  data: T;
}

export interface IWebhookEntityEventData<T> extends IWebhookEventData<T> {
  entityId: string;
  correlationId: string;
}

export type TWebhookEventData<T> = IWebhookEventData<T> | IWebhookEntityEventData<T>;

export type TEventName<T> = TWebhookEventData<T>['eventName'] | (string & {});

export type ExtractWebhookEventData<T, TEvent extends TEventName<T>> = Omit<
  Extract<
    TWebhookEventData<T>,
    {
      eventName: TEvent;
    }
  >,
  'eventName'
>;
