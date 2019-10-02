import Controller from './Controller/Controller';
import IFullSettings from './Interfaces/IFullSettings';
import Observer from './Observer/Observer';

class Application extends Observer {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    super();
    this.createSlider(settings);
  }

  public onNewSettings = (settings: IFullSettings, eventType: string): void => {
    this.publish('onNewSettings', settings, eventType);
  }

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.subscribe(this.controller.getSettings, 'getSettings');
    this.subscribe(this.controller.onChangedSettings, 'setSettings');

    this.controller.subscribe(this.onNewSettings, 'onNewSettings');
  }
}

export default Application;
