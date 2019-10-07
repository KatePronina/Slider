export default interface IModelSettings {
  type: string;
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  direction: string;
  hint: boolean;
  scale: boolean;
  positionLength: number | number[] | null;
  positionPercent?: number;
  valueType?: string;
}
