import Model from '../Model/Model';
import View from '../View/View';
import Observer from '../Observer/Observer';
import IFullSettings from '../Interfaces/IFullSettings';

class Controller extends Observer {
  private model: Model;

  private view: View;

  public constructor(settings: IFullSettings) {
    super();
    this.model = new Model(settings);
    this.view = new View({ ...settings,
      value: this.model.state.value,
      positionLength: this.model.positionLength,
    });

    this.bindEvents();
  }

  public getSettings = (): void => {
    const newSettings = this.model.getSettings();
    this.onNewSettings(newSettings);
  }

  public onChangedSettings = (settings: IFullSettings): void => {
    this.model.onNewState(settings);
  }

  public onNewValue = (value: number | number[], valueType?: string): void => {
    this.model.setValue(value, valueType);
  }

  public onNewSettings = (settings: IFullSettings): void => {
    this.publish('onNewSettings', settings);
  }

  public onChangedValue = (value: number | number[], newPositionLength: number | number[]): void => {
    this.view.onChangedValue(value, newPositionLength);
    this.publish('onChangedValue', value);
  }

  private bindEvents(): void {
    this.view.subscribe(this.onNewValue, 'newValue');
    this.view.subscribe(this.onNewPositionPercent, 'newPositionPercent');

    this.model.subscribe(this.onChangedValue, 'onSetValue');
    this.model.subscribe(this.onSetState, 'onSetState');
  }

  private onSetState = (settings: IFullSettings) => {
    this.view.remove();
    this.view.initSlider(settings);
    this.onNewSettings(settings);
  }

  private onNewPositionPercent = (positionPercent: number, valueType?: string) => {
    this.model.onNewPositionPercent(positionPercent, valueType);
  }
}

export default Controller;
