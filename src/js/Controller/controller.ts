import Model from '../Model/model';
import View from '../View/view';

class Controller {
    public model: Model;
    public view: View;

    public constructor(model: Model) {
        this.model = model;
        this.view = new View(this.model.state);

        this.view.onNewValue = (value): void => {
            this.model.setValue(value);
        }
        this.model.onSetValue = (value): void => {
            this.view.onChangedValue(value);
        }
    }
}

export default Controller;