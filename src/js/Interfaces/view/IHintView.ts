export default interface IHintView {
  offset: number;
  update(value: number | number[], percent: number): void;
  setSizes(sliderLength: number): void;
}
