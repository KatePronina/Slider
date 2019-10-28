export default interface ISingleSliderView {
  update(newPositionLength: number[]): void;
  onPositionPercentChange(positionPercent: number): void;
}
