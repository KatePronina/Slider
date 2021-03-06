import Model from '../Model/Model';
import View from '../Views/View';
import Observer from '../Observer/Observer';
import IFullSettings from '../Interfaces/IFullSettings';
import { INewParams, IController } from '../Interfaces/controller/IController';
import { IModelSettings } from '../Interfaces/model/IModel';

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

  public updateState = (params: INewParams): void => {
    const settings = this.model.getState();

    if (params.eventType) {
      this.model.dispatchState({
        ...settings,
        ...params,
      }, params.eventType);
    }
  }

  public notifySubscribers = (eventType: 'positionPercentUpdated' | 'stateUpdated'): void => {
    const settings = this.model.getState();
    this.notify(eventType, settings);
  }

  private subscribeNotifications(): void {
    this.view.subscribe(this.updateState, 'dispatchOptions');
    this.model.subscribe(this.getState, 'stateUpdated');
  }

  private getState = (settings: IModelSettings, eventType: 'positionPercentUpdated' | 'stateUpdated') => {
    switch (eventType) {
      case 'positionPercentUpdated':
        if (settings.positionLength) {
          this.view.changeSlider(settings.value, settings.positionLength);
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
