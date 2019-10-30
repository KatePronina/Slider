export default interface IHintView {
  update(value: number | number[], percent: number): void;
  setOffset(sliderLength: number): void;
}
