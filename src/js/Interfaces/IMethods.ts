import IPluginSettings from './IPluginSettings';

export default interface IMethods {
  [index: string]: any;
  init(options: IPluginSettings): void;
}
