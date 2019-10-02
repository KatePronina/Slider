import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';
import IFullSettings from '../Interfaces/IFullSettings';
import INewParams from '../Interfaces/controller/INewParams';

class Controller extends Observer {
  private model: Model;

  private view: View;

  public constructor(settings: IFullSettings) {
    super();
    this.model = new Model(settings);
    const newSettings = this.model.getSettings();
    this.view = new View(newSettings);
    this.bindEvents();
  }

  public getSettings = (): void => {
    const newSettings = this.model.getSettings();
    this.onNewSettings(newSettings);
  }

  public onChangedSettings = (params: INewParams): void => {
    const settings = this.model.getSettings();
    this.model.onNewState({
      ...settings,
      ...params,
    }, 'settingsUpdated');
  }

  public onNewSettings = (settings: IFullSettings): void => {
    this.publish('onNewSettings', {
      ...settings,
      positionLength: null,
    });
  }

  public onChangedValue = (value: number | number[], newPositionLength: number | number[]): void => {
    this.view.onChangedValue(value, newPositionLength);
    this.publish('onChangedValue', value);
  }

  private bindEvents(): void {
    this.view.subscribe(this.onChangedSettings, 'newValue');
    this.view.subscribe(this.onNewPositionPercent, 'newPositionPercent');

    this.model.subscribe(this.onSetState, 'onSetState');
  }

  private onSetState = (settings: IFullSettings, eventType: string) => {
    switch (eventType) {
      case 'positionPercentUpdated':
        settings.positionLength && this.view.onChangedValue(settings.value, settings.positionLength);
        this.publish('onChangedValue', settings.value);
        break;
      case 'settingsUpdated':
        this.view.remove();
        this.view.initSlider(settings);
        this.onNewSettings(settings);
        break;
    }
  }

  private onNewPositionPercent = (positionPercent: number, valueType?: string) => {
    const settings = this.model.getSettings();
    this.model.onNewState({
      ...settings,
      positionPercent,
      valueType,
    }, 'positionPercentUpdated');
  }
}

export default Controller;
