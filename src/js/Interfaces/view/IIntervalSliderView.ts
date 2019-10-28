export default interface IIntervalSliderView {
  onChangedValue(value: number[], newPositionLength: number[]): void;
  onPositionPercentChange(positionPercent: number[], valueType: string): void;
}
