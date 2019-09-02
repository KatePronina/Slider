import Controller from './Controller/Controller';
import IFullSettings from './Interfaces/IFullSettings';

class Application {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    this.createSlider(settings);
  }

  public setValue(value: number | number[], valueType?: string): void {
    this.controller.onNewValue(value, valueType);
  }

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);
  }
}

export default Application;
