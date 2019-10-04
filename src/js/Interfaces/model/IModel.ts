import IFullSettings from '../IFullSettings';

export default interface IView {
  getSettings(): IFullSettings;
  onNewState(newState: IFullSettings, eventType: string): void;
}
