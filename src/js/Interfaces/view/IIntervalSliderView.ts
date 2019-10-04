export default interface IIntervalSliderView {
  minPointDOMElement: HTMLElement | null;
  maxPointDOMElement: HTMLElement | null;

  onChangedValue(value: number[], newPositionLength: number[]): void;
  onPositionPercentChange(positionPercent: number, valueType: string): void;
}
