import INewParams from './INewParams';

export default interface IController {
  notifySubscribersByUpdatedState(eventType: string): void;
  updateState(params: INewParams, eventType: string): void;
}
