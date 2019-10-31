export default interface ISliderSettings {
  minValue: number;
  maxValue: number;
  positionLength: number[];
  $parentElement: JQuery<HTMLElement>;
  direction: 'horizontal' | 'vertical';
}
