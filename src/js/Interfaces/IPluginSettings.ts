import { IModelSettings } from './model/IModel';

export default interface IPluginSettings {
  $parentElement: JQuery;
  type: 'single' | 'interval';
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  direction: 'horizontal' | 'vertical';
  hint: boolean;
  scale: boolean;
  events: {
    onNewValue: (value: number | number[]) => {};
    onNewSettings: (settings: IModelSettings) => {};
  };
}
