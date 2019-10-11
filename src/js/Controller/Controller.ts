import constants from '../constants';
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

  public constructor(settings: IFullSettings) {
    super();
    this.model = new Model({
      value: settings.value,
      positionLength: settings. positionLength,
      type: settings.type,
      minValue: settings.minValue,
      maxValue: settings.maxValue,
      step: settings.step,
      direction: settings.direction,
      hint: settings.hint,
      scale: settings.scale,
    });
    const newSettings = this.model.getState();
    this.view = new View({ ...newSettings, $parentElement: settings.$parentElement });
    this.bindEvents();
  }

  public getSettings = (): void => {
    const newSettings = this.model.getState();
    this.onNewSettings(newSettings, 'settingsUpdated');
  }

  public onChangedSettings = (params: INewParams): void => {
    const settings = this.model.getState();
    this.model.dispatchState({
      ...settings,
      ...params,
    }, 'settingsUpdated');
  }

  private onNewSettings = (settings: IModelSettings, eventType: string): void => {
    const $parentElement = this.view.getParentElement();
    this.publish('settingsUpdated', {
      ...settings,
      $parentElement,
      positionLength: null,
    }, eventType);
  }

  private bindEvents(): void {
    this.view.subscribe(this.onChangedSettings, 'valueUpdated');
    this.view.subscribe(this.onNewPositionPercent, 'positionPercentUpdated');

    this.model.subscribe(this.onSetState, 'stateUpdated');
  }

  private onSetState = (settings: IModelSettings, eventType: string) => {
    switch (eventType) {
      case 'positionPercentUpdated':
        if (typeof settings.positionLength === 'number' || settings.positionLength instanceof Array) {
          this.view.onChangedValue(settings.value, settings.positionLength);
        }
        this.onNewSettings(settings, eventType);
        break;
      case 'settingsUpdated':
        const $parentElement = this.view.getParentElement();
        this.view.remove();
        this.view.initSlider({ ...settings, $parentElement });
        this.onNewSettings(settings, eventType);
        break;
    }
  }

  private onNewPositionPercent = (positionPercent: number | number[], valueType?: string) => {
    const settings = this.model.getState();

    this.model.dispatchState({
      ...settings,
      positionPercent,
      valueType,
    }, 'positionPercentUpdated');
  }
}

export default Controller;
