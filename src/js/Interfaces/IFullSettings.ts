export default interface IFullSettings {
  $parentElement: JQuery;
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
