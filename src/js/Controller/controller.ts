import Model from '../Model/model';
import View from '../View/view';

class Controller {
    public model: Model;
    public view: View;

    public constructor(model: Model) {
        this.model = model;
        this.view = new View(this.model.state);
    }
}

export default Controller;