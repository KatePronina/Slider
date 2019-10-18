export default interface IModelSettings {
  type: 'single' | 'interval';
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  direction: 'horizontal' | 'vertical';
  hint: boolean;
  scale: boolean;
  positionLength: number | number[] | null;
  positionPercent?: number | number[];
  valueType?: string;
}
