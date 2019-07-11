import { ISettings } from './application.interfaces';
import Model from './Model/model';
import Controller from './Controller/controller';

class Application {
  private controller: Controller;

  public constructor(settings: ISettings) {
    this.createSlider(settings);
  }

  public createSlider(settings: ISettings): void {
    const model: Model = new Model(settings);
    this.controller = new Controller(model);
  }

  public setValue(value: number | number[], valueType?: string): void {
    this.controller.onNewValue(value, valueType);
  }
}

export default Application;
