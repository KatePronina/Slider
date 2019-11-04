import Controller from './Controller/Controller';
import Observer from './Observer/Observer';
import IFullSettings from './Interfaces/IFullSettings';
import { IModelSettings } from './Interfaces/model/IModel';

class Application extends Observer {
  private controller: Controller;

  public constructor(settings: IFullSettings) {
    super();
    this.establishSlider(settings);
  }

  private notifyAboutState = (settings: IModelSettings): void => {
    this.notify('stateUpdated', settings);
  }

  private notifyAboutValue = (settings: IModelSettings): void => {
    this.notify('positionPercentUpdated', settings);
  }

  private establishSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.subscribe(this.controller.notifySubscribers, 'sliderInitialized');
    this.subscribe(this.controller.updateState, 'dispatchOptions');

    this.controller.subscribe(this.notifyAboutState, 'stateUpdated');
    this.controller.subscribe(this.notifyAboutValue, 'positionPercentUpdated');
  }
}

export default Application;
