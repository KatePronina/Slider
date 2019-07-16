import Model from '../Model/model';
import View from '../View/view';
import IFullSettings from '../application.interfaces';

class Controller {
  private model: Model;

  private view: View;

  public constructor(settings: IFullSettings) {
    this.model = new Model(settings);
    this.view = new View({ ...settings, value: this.model.state.value });

    this.bindEvents();
  }

  public onNewValue(value: number | number[], valueType?: string): void {
    this.model.setValue(value, valueType);
  }

  private bindEvents(): void {
    this.view.onNewValue = (value, valueType?: string): void => {
      this.model.setValue(value, valueType);
    };

    this.model.onSetValue = (value): void => {
      this.view.onChangedValue(value);
    };

    this.view.onDirectionChange = (newState): void => {
      this.view.remove();
      this.view.initSlider(newState);
    };

    this.view.onStateChange = (newState): void => {
      this.model.onNewState(newState);
    };

    this.model.onSetState = (newState): void => {
      this.view.remove();
      this.view.initSlider(newState);
    };
  }
}

export default Controller;
