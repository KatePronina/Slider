export default interface IValidateValue {
  type: string;
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  valueType?: string;
  positionPercent?: number;
}
