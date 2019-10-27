import TData from './TData';
import TEvents from './TEvents';

export default interface IObserver {
  notify(callback: Function, type: TEvents): void;
  publish(type: TEvents, ...data: TData): void;
}
