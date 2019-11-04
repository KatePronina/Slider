import IFullSettings from '../IFullSettings';
import { IModelSettings } from '../model/IModel';
import { INewParams } from '../controller/IController';

export interface IObserver {
  subscribe(callback: Function, type: TEvents): void;
  notify(type: TEvents, ...data: TData): void;
}

export interface ISubscribers {
  [key: string]: Function[];
}

export type TData = [
  (IFullSettings | IModelSettings | 'stateUpdated' | INewParams),
  ('stateUpdated' | 'positionPercentUpdated')?,
];

export type TEvents = 'sliderInitialized'
              | 'dispatchOptions'
              | 'positionPercentUpdated'
              | 'stateUpdated';
