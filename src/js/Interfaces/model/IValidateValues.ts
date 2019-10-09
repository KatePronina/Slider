export default interface IValidateValues {
  type: string;
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  valueType?: string;
  positionPercent?: number;
}
