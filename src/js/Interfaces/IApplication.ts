import IFullSettings from './IFullSettings';

export default interface IApplication {
  onNewSettings(settings: IFullSettings, eventType: string): void;
}
