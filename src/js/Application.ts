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
    this.publish('stateUpdated', settings);
  }

  private notifyAboutValue = (settings: IModelSettings): void => {
    this.publish('positionPercentUpdated', settings);
  }

  private establishSlider(settings: IFullSettings): void {
    this.controller = new Controller(settings);

    this.notify(this.controller.notifySubscribers, 'sliderInitialized');
    this.notify(this.controller.updateState, 'dispatchOptions');

    this.controller.notify(this.notifyAboutState, 'stateUpdated');
    this.controller.notify(this.notifyAboutValue, 'positionPercentUpdated');
  }
}

export default Application;
