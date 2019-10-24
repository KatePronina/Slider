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
    this.bindNotifications();
  }

  public updateState = (params: INewParams, eventType?: string): void => {
    const settings = this.model.getState();

    if (eventType) {
      this.model.dispatchState({
        ...settings,
        ...params,
      }, eventType);
    } else {
      this.model.dispatchState({
        ...settings,
        ...params,
      }, 'stateChanged');
    }
  }

  public sendStateNotification = (eventType: string): void => {
    const settings = this.model.getState();
    const $parentElement = this.view.getParentElement();
    this.publish('stateUpdated', {
      ...settings,
      $parentElement,
    }, eventType);
  }

  private bindNotifications(): void {
    this.view.notify(this.updateState, 'settingsUpdated');
    this.model.notify(this.receiveState, 'stateUpdated');
  }

  private receiveState = (settings: IModelSettings, eventType: string) => {
    switch (eventType) {
      case 'positionPercentUpdated':
        if (typeof settings.positionLength !== 'undefined') {
          this.view.onChangedValue(settings.value, settings.positionLength);
        }
        this.sendStateNotification(eventType);
        break;
      case 'stateChanged':
        const $parentElement = this.view.getParentElement();
        this.view.remove();
        this.view.initSlider({ ...settings, $parentElement });
        this.sendStateNotification(eventType);
        break;
    }
  }
}

export default Controller;
