import Controller from './Controller/Controller';
import IFullSettings from './Interfaces/IFullSettings';
import Observer from './Observer/Observer';

class Application extends Observer {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    super();
    this.createSlider(settings);
  }

  private sendStateNotification = (settings: IFullSettings, eventType: string): void => {
    this.publish('stateUpdated', settings, eventType);
  }

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.notify(this.controller.sendStateNotification, 'sliderInitialized');
    this.notify(this.controller.updateState, 'dispatchNewSettings');

    this.controller.notify(this.sendStateNotification, 'stateUpdated');
  }
}

export default Application;
