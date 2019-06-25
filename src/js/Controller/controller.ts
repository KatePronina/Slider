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
    }
}

export default Controller;