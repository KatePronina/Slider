export default interface IIntervalSliderView {
  update(value: number[], newPositionLength: number[]): void;
  dispatchPositionPercent(positionPercent: number[], valueType: string): void;
}
