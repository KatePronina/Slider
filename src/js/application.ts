import Controller from './Controller/Controller';
import IFullSettings from './Interfaces/IFullSettings';
import Observer from './Observer/Observer';

class Application extends Observer {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    super();
    this.createSlider(settings);
  }

  private notifyOfNewState = (settings: IFullSettings, eventType: string): void => {
    this.publish('stateUpdated', settings, eventType);
  }

  private createSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.subscribe(this.controller.notifyOfNewState, 'sliderInitialized');
    this.subscribe(this.controller.stateChanged, 'dispatchNewSettings');

    this.controller.subscribe(this.notifyOfNewState, 'stateUpdated');
  }
}

export default Application;
