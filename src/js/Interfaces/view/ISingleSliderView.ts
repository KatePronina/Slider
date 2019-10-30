export default interface ISingleSliderView {
  update(newPositionLength: number[]): void;
  dispatchPositionPercent(positionPercent: number): void;
}
