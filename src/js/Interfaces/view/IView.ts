import IFullSettings from '../IFullSettings';

export default interface IView {
  initViews(settings: IFullSettings): void;
  updateViews(value: number | number[], newPositionLength: number | number[]): void;
  getParentElement(): JQuery;
}
