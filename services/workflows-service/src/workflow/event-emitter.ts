export class EventEmitter {
  #__callbacks: any = {};

  subscribe(status: string, callback: any) {
    this.#__callbacks[status] ??= [];
    this.#__callbacks[status].push(callback);
  }

  emit(status: string, data: any) {
    this.#__callbacks[status]?.forEach((callback: any) => {
      callback(data);
    });
  }
}
