import {Settings} from './application.interfaces';
import Model from './Model/model';
import Controller from './Controller/controller';

class Application {
  public constructor(settings: Settings) {
    this.createSlider(settings);
  }

  public createSlider(settings: Settings): void {
    const model: Model = new Model(settings);
    new Controller(model);
  }
}

export default Application;