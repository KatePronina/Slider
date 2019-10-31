export default interface IScaleSettings {
  minValue: number;
  maxValue: number;
  step: number;
  direction: 'horizontal' | 'vertical';
  sliderSize: number;
  $parentElement: JQuery<HTMLElement>;
}
