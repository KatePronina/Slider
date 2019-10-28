export default interface IIntervalSliderView {
  maxPointDOMElement: HTMLElement | null;

  onChangedValue(value: number[], newPositionLength: number[]): void;
  onPositionPercentChange(positionPercent: number[], valueType: string): void;
}
