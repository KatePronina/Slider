export default interface ISingleSliderView {
  pointDOMElement: HTMLElement | null;

  onChangedValue(newPositionLength: number): void;
  onPositionPercentChange(positionPercent: number): void;
}