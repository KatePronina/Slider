export default interface IScaleSettings {
  minValue: number;
  maxValue: number;
  step: number;
  direction: 'horizontal' | 'vertical';
  sliderLength: number;
  $parentElement: JQuery<HTMLElement>;
}
