export default interface IHintView {
  offset: number;
  onChangedValue(value: number | number[], percent: number): void;
  setSizes(sliderLength: number): void;
}
