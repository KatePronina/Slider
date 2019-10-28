export default interface IIntervalSliderView {
  update(value: number[], newPositionLength: number[]): void;
  onPositionPercentChange(positionPercent: number[], valueType: string): void;
}
