import ISubscribers from '../Interfaces/observer/ISubscribers';
import IObserver from '../Interfaces/observer/IObserver';
import TEvents from '../Interfaces/observer/TEvents';
import TData from '../Interfaces/observer/TData';

class Observer implements IObserver {
  private subscribers: ISubscribers;

  constructor() {
    this.subscribers = {};
  }

  public notify(callback: Function, type: TEvents): void {
    this.subscribers[type] = this.subscribers[type] || [];
    this.subscribers[type].push(callback);
  }

  public publish(type: TEvents, ...data: TData):void {
    const subscribers = this.subscribers[type];

    subscribers.forEach((subscriber) => {
      subscriber(...data);
    });
  }
}

export default Observer;
