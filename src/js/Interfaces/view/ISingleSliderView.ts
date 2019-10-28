export default interface ISingleSliderView {
  onChangedValue(newPositionLength: number[]): void;
  onPositionPercentChange(positionPercent: number): void;
}
