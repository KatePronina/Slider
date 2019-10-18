export default interface ISliderSettings {
  minValue: number;
  maxValue: number;
  value: number | number[];
  direction: 'horizontal' | 'vertical';
}
