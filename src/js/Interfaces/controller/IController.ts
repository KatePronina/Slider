import INewParams from './INewParams';

export default interface IController {
  sendStateNotification(eventType: string): void;
  updateState(params: INewParams): void;
}
