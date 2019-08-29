export default interface IModelSettings {
  type: string;
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
}
