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
    this.bindEvents();
  }

  public stateChanged = (params: INewParams): void => {
    const settings = this.model.getState();
    this.model.dispatchState({
      ...settings,
      ...params,
    }, 'stateChanged');
  }

  public notifyOfNewState = (eventType: string): void => {
    const settings = this.model.getState();
    const $parentElement = this.view.getParentElement();
    this.publish('stateUpdated', {
      ...settings,
      $parentElement,
      positionLength: null,
    }, eventType);
  }

  private bindEvents(): void {
    this.view.subscribe(this.stateChanged, 'valueUpdated');
    this.view.subscribe(this.positionPercentUpdated, 'positionPercentUpdated');

    this.model.subscribe(this.stateUpdated, 'stateUpdated');
  }

  private stateUpdated = (settings: IModelSettings, eventType: string) => {
    switch (eventType) {
      case 'positionPercentUpdated':
        if (typeof settings.positionLength === 'number' || settings.positionLength instanceof Array) {
          this.view.onChangedValue(settings.value, settings.positionLength);
        }
        this.notifyOfNewState(eventType);
        break;
      case 'stateChanged':
        const $parentElement = this.view.getParentElement();
        this.view.remove();
        this.view.initSlider({ ...settings, $parentElement });
        this.notifyOfNewState(eventType);
        break;
    }
  }

  private positionPercentUpdated = (positionPercent: number | number[], valueType?: string) => {
    const settings = this.model.getState();

    this.model.dispatchState({
      ...settings,
      positionPercent,
      valueType,
    }, 'positionPercentUpdated');
  }
}

export default Controller;
