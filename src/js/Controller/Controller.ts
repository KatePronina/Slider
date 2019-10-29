import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';
import IFullSettings from '../Interfaces/IFullSettings';
import INewParams from '../Interfaces/controller/INewParams';
import IController from '../Interfaces/controller/IController';
import IModelSettings from '../Interfaces/model/IModelSettings';

class Controller extends Observer implements IController {
  private model: Model;
  private view: View;

  public constructor({
    value, positionLength, type, minValue, maxValue, step, direction, hint, scale, $parentElement,
  }: IFullSettings) {
    super();

    this.model = new Model({
      value, positionLength, type, minValue, maxValue, step, direction, hint, scale,
    });

    const newSettings = this.model.getState();
    this.view = new View({ ...newSettings, $parentElement });
    this.subscribeNotifications();
  }

  public updateState = (params: INewParams, eventType: 'positionPercentUpdated' | 'stateUpdated'): void => {
    const settings = this.model.getState();

    this.model.dispatchState({
      ...settings,
      ...params,
    }, eventType);
  }

  public notifySubscribers = (eventType: 'positionPercentUpdated' | 'stateUpdated'): void => {
    const settings = this.model.getState();
    this.publish(eventType, settings);
  }

  private subscribeNotifications(): void {
    this.view.notify(this.updateState, 'dispatchNewSettings');
    this.model.notify(this.getState, 'stateUpdated');
  }

  private getState = (settings: IModelSettings, eventType: 'positionPercentUpdated' | 'stateUpdated') => {
    switch (eventType) {
      case 'positionPercentUpdated':
        if (settings.positionLength) {
          this.view.updateViews(settings.value, settings.positionLength);
        }
        break;
      case 'stateUpdated':
        this.view.redrawSlider(settings);
        break;
    }
    this.notifySubscribers(eventType);
  }
}

export default Controller;
