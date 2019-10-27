import Controller from './Controller/Controller';
import IFullSettings from './Interfaces/IFullSettings';
import Observer from './Observer/Observer';

class Application extends Observer {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    super();
    this.createSlider(settings);
  }

  private sendStateNotification = (settings: IFullSettings): void => {
    this.publish('stateUpdated', settings);
  }

  private sendValueNotification = (settings: IFullSettings): void => {
    this.publish('positionPercentUpdated', settings);
  }

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.notify(this.controller.notifySubscribers, 'sliderInitialized');
    this.notify(this.controller.updateState, 'dispatchNewSettings');

    this.controller.notify(this.sendStateNotification, 'stateUpdated');
    this.controller.notify(this.sendValueNotification, 'positionPercentUpdated');
  }
}

export default Application;
