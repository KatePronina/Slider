export interface IValidateValues {
  type: 'single' | 'interval';
  value: number | number[];
  minValue: number;
  maxValue: number;
  step: number;
  valueType?: string;
}

export interface IValidateSingleValue extends IValidateValues {
  type: 'single';
  value: number;
  positionPercent?: number;
}

export interface IValidateIntervalValue extends IValidateValues {
  type: 'interval';
  value: number[];
  positionPercent?: number[];
}
