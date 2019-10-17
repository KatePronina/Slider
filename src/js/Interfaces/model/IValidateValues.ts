export interface IValidateValues {
  type: string;
  value: number | number[];
  minValue: number;
  maxValue: number;
  step: number;
  valueType?: string;
}

export interface IValidateSingleValue extends IValidateValues {
  value: number;
  positionPercent?: number;
}

export interface IValidateIntervalValue extends IValidateValues {
  value: number[];
  positionPercent?: number[];
}
