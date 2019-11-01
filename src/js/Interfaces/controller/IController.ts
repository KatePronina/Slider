export interface IController {
  notifySubscribers(eventType: string): void;
  updateState(params: INewParams, eventType: string): void;
}

export interface INewParams {
  [key: string]: number | number[] | boolean | string | undefined;
  eventType?: 'positionPercentUpdated' | 'stateUpdated';
}
