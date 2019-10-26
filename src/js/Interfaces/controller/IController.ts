import INewParams from './INewParams';

export default interface IController {
  notifySubscribers(eventType: string): void;
  updateState(params: INewParams, eventType: string): void;
}
