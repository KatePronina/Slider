export default interface IObserver {
  notify(callback: Function, type: string): void;
  publish(type: string, data: any): void;
}
