import IFullSettings from '../IFullSettings';

export default interface IView {
  initSlider(settings: IFullSettings): void;
  onChangedValue(value: number | number[], newPositionLength: number | number[]): void;
  getParentElement(): JQuery;
}
