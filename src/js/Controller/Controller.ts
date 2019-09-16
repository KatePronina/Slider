import Model from '../Model/Model';
import View from '../View/View';
import IFullSettings from '../Interfaces/IFullSettings';

class Controller {
  private model: Model;

  private view: View;

  public constructor(settings: IFullSettings) {
    this.model = new Model(settings);
    this.view = new View({ ...settings,
      value: this.model.state.value,
      positionLength: this.model.positionLength,
    });

    this.bindEvents();
  }

  public getSettings(): void {
    const newSettings = this.model.getSettings();
    this.onNewSettings(newSettings);
  }

  public onChangedSettings = (settings: IFullSettings): void => {
    this.model.onNewState(settings);
  }

  public onNewValue(value: number | number[], valueType?: string): void {
    this.model.setValue(value, valueType);
  }

  public onNewSettings = (settings: IFullSettings): void => {};

  public onChangedValue = (value: number | number[]): void => {};

  private bindEvents(): void {
    this.view.onNewValue = (value, valueType?: string): void => {
      this.model.setValue(value, valueType);
    };

    this.view.onNewPositionPercent = (positionPercent: number, valueType?: string): void => {
      this.model.onNewPositionPercent(positionPercent, valueType);
    };

    this.model.onSetValue = (value, newPositionLength): void => {
      this.view.onChangedValue(value, newPositionLength);
      this.onChangedValue(value);
    };

    this.model.onSetState = (newState): void => {
      this.view.remove();
      this.view.initSlider(newState);
      this.onNewSettings(newState);
    };
  }
}

export default Controller;
