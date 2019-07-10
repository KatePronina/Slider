import Model from '../Model/model';
import View from '../View/view';

class Controller {
  public model: Model;
  public view: View;

  public constructor(model: Model) {
    this.model = model;
    this.view = new View(this.model.state);

    this.view.onNewValue = (value, valueType?: string): void => {
      this.model.setValue(value, valueType);
    }

    this.model.onSetValue = (value): void => {
      this.view.onChangedValue(value);
    }

    this.view.onDirectionChange = (newState): void => {
      this.view.remove();
      this.view.initSlider(newState);
    }

    this.view.onStateChange = (newState): void => {
      this.model.onNewState(newState);
    }

    this.model.onSetState = (newState): void => {
      this.view.remove();
      this.view.initSlider(newState);
    }
  }

  public onNewValue(value: number | number[], valueType?: string): void {
    this.model.setValue(value, valueType);
  }
}

export default Controller;