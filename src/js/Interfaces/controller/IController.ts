import INewParams from './INewParams';

export default interface IController {
  notifyOfNewState(eventType: string): void;
  stateChanged(params: INewParams): void;
}
