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

  public setSettings(settings: IFullSettings): void {
    this.controller.onChangedSettings(settings);
  }

  public getSettings(): void {
    this.controller.getSettings();
  }

  public onNewValue = (value: number | number[]): void => {};

  public onNewSettings = (setting: IFullSettings): void => {};

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.controller.onChangedValue = (value) => {
      this.onNewValue(value);
    };

    this.controller.onNewSettings = (settings: IFullSettings): void => {
      this.onNewSettings(settings);
    };
  }
}

export default Application;
