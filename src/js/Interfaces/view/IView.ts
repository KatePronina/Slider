import IModelSettings from '../../Interfaces/model/IModelSettings';

export default interface IView {
  updateViews(value: number | number[], newPositionLength: number | number[]): void;
  redrawSlider(newSettings: IModelSettings): void;
}
