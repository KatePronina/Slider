export default interface IScaleView {
  sliderLength: number;
  alignValues(): void;
  onNewValue(value: number): void;
}
