export default interface ISingleSliderView {
  pointDOMElement: HTMLElement | null;

  onChangedValue(newPositionLength: []): void;
  onPositionPercentChange(positionPercent: number): void;
}
