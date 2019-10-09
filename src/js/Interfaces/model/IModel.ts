import IModelSettings from '../../Interfaces/model/IModelSettings';

export default interface IView {
  getState(): IModelSettings;
  dispatchState(newState: IModelSettings, eventType: string): void;
}
