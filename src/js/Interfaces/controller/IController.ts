export interface IController {
  notifySubscribers(eventType: string): void;
  updateState(params: INewParams, eventType: string): void;
}

export interface INewParams {
  type?: 'single' | 'interval';
  minValue?: number;
  maxValue?: number;
  value?: number | number[];
  step?: number;
  direction?: 'horizontal' | 'vertical';
  hint?: boolean;
  scale?: boolean;
  positionPercent?: number | number[];
  valueType?: string;
  eventType?: 'positionPercentUpdated' | 'stateUpdated';
}
