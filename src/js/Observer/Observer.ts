import ISubscribers from '../Interfaces/observer/ISubscribers';
import IObserver from '../Interfaces/observer/IObserver';

class Observer implements IObserver {
  private subscribers: ISubscribers;

  constructor() {
    this.subscribers = {};
  }

  public notify(callback: Function, type: string): void {
    this.subscribers[type] = this.subscribers[type] || [];
    this.subscribers[type].push(callback);
  }

  public publish(type: string, ...data: any):void {
    const subscribers = this.subscribers[type];

    subscribers.forEach((subscriber) => {
      subscriber(...data);
    });
  }
}

export default Observer;
