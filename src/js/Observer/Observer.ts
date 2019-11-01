import { IObserver, ISubscribers, TData, TEvents } from '../Interfaces/observer/IObserver';

class Observer implements IObserver {
  private subscribers: ISubscribers;

  constructor() {
    this.subscribers = {};
  }

  public notify(callback: Function, type: TEvents): void {
    this.subscribers[type] = this.subscribers[type] ? [...this.subscribers[type], callback] : [callback];
  }

  public publish(type: TEvents, ...data: TData):void {
    const subscribers = this.subscribers[type];

    subscribers.forEach((subscriber) => {
      subscriber(...data);
    });
  }
}

export default Observer;
