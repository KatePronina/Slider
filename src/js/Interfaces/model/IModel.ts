export interface IModel {
  getState(): IModelSettings;
  dispatchState(newState: IModelSettings, eventType: string): void;
}

export interface IConvertPercentsToIntervalValues {
  currentValue: number[];
  positionPercent: number[];
  valueType: string;
}

export interface IModelSettings {
  type: 'single' | 'interval';
  minValue: number;
  maxValue: number;
  value: number[];
  step: number;
  direction: 'horizontal' | 'vertical';
  hint: boolean;
  scale: boolean;
  positionLength?: number[];
  positionPercent?: number | number[];
  valueType?: string;
}

export interface IValidateValues {
  type: 'single' | 'interval';
  value: number[];
  minValue: number;
  maxValue: number;
  step: number;
  valueType?: string;
}

export interface IValidateSingleValue extends IValidateValues {
  type: 'single';
  value: number[];
  positionPercent?: number;
}

export interface IValidateIntervalValue extends IValidateValues {
  type: 'interval';
  value: number[];
  positionPercent?: number[];
}

export interface ICheckValue {
  minValue: number;
  maxValue: number;
  value: number;
  step: number;
}
