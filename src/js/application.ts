import Controller from './Controller/Controller';
import IFullSettings from './Interfaces/IFullSettings';
import IApplication from './Interfaces/IApplication';
import Observer from './Observer/Observer';

class Application extends Observer implements IApplication {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    super();
    this.createSlider(settings);
  }

  public onNewSettings = (settings: IFullSettings, eventType: string): void => {
    this.publish('settingsUpdated', settings, eventType);
  }

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.subscribe(this.controller.getSettings, 'getSettings');
    this.subscribe(this.controller.onChangedSettings, 'setSettings');

    this.controller.subscribe(this.onNewSettings, 'settingsUpdated');
  }
}

export default Application;
