export default interface IRangeSliderView {
  pointDOMElement: HTMLElement | null;

  onChangedValue(newPositionLength: number): void;
  onPositionPercentChange(positionPercent: number): void;
}
