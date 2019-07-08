import Model from '../Model/model';
import View from '../View/view';
import {FullSettings} from '../application.interfaces';

class Controller {
  public model: Model;
  public view: View;

  public constructor(model: Model) {
    this.model = model;
    this.view = new View(this.model.state);

    this.view.onNewValue = (value, valueType?: string): void => {
      this.model.setValue(value, valueType);
    }

    this.view.onDirectionChange = (newState: FullSettings): void => {
      this.view.remove();
      this.view.initSlider(newState);
    }

    this.model.onSetValue = (value): void => {
      this.view.onChangedValue(value);
    }
  }
}

export default Controller;