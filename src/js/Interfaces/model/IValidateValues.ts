interface IValidateValues {
  type: string;
  minValue: number;
  maxValue: number;
  step: number;
  valueType?: string;
}

export interface IValidateRangeValue extends IValidateValues {
  value: number;
}

export interface IValidateIntervalValue extends IValidateValues {
  value: number[];
}
