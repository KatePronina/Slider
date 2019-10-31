export default interface IHintSettings {
  value: number | number[];
  type: 'single' | 'interval';
  direction: 'horizontal' | 'vertical';
  isMaxValue?: boolean;
  $parentElement: JQuery<HTMLElement>;
}
