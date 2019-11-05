import { INewParams } from '../js/Interfaces/controller/IController';
import { IModelSettings } from '../js/Interfaces/model/IModel';

export interface ISliderData {
  configurationClass: string;
  sliderClass: string;
  settings?: INewParams;
}

export interface IConfigurationView {
  updateValueInputs(value: number | number[]): void;
  redrawConfiguration(settings: IModelSettings): void;
}
