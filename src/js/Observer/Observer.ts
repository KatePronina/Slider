import ISubscribers from '../Interfaces/observer/ISubscribers';

class Observer {
  private subscribers: ISubscribers;

  constructor() {
    this.subscribers = { any: [] };
  }

  public notify(callback: Function, type: string = 'any'): void {
    if (typeof this.subscribers[type] === 'undefined') {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push(callback);
  }

  public publish(type: string = 'any', ...data: any):void {
    const subscribers = this.subscribers[type];

    subscribers.forEach((subscriber) => {
      subscriber(...data);
    });
  }
}

export default Observer;
