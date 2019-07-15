import Controller from './Controller/controller';
import IFullSettings from './application.interfaces';

class Application {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    this.createSlider(settings);
  }

  public createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);
  }

  public setValue(value: number | number[], valueType?: string): void {
    this.controller.onNewValue(value, valueType);
  }
}

export default Application;
