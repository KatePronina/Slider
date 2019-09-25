import Controller from './Controller/Controller';
import IFullSettings from './Interfaces/IFullSettings';
import Observer from './Observer/Observer';

class Application extends Observer {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    super();
    this.createSlider(settings);
  }

  public onNewValue = (value: number | number[]): void => {
    this.publish('onNewValue', value);
  }

  public onNewSettings = (setting: IFullSettings): void => {
    this.publish('onNewSettings', setting);
  }

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.subscribe(this.controller.getSettings, 'getSettings');
    this.subscribe(this.controller.onChangedSettings, 'setSettings');

    this.controller.subscribe(this.onNewValue, 'onChangedValue');
    this.controller.subscribe(this.onNewSettings, 'onNewSettings');
  }
}

export default Application;
