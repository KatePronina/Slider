import IModelSettings from '../../Interfaces/model/IModelSettings';

export default interface IView {
  getSettings(): IModelSettings;
  onNewState(newState: IModelSettings, eventType: string): void;
}
