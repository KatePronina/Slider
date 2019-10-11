export interface IValidateValues {
  type: string;
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  valueType?: string;
}

export interface IValidateRangeValue extends IValidateValues {
  value: number;
}

export interface IValidateIntervalValue extends IValidateValues {
  value: number[];
}
