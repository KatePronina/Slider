import {Settings} from './application.interfaces';
import Model from './Model/model';
import Controller from './Controller/controller';

class Application {
  public constructor(settings: Settings) {
    this.createSlider(settings);
  }

  public createSlider(settings: Settings): void {
    const model: Model = new Model(settings);
    const controller: Controller = new Controller(model);
  }
}

const firstSlider = new Application({parentId: 'first-slider'});
const secondSlider = new Application({parentId: 'second-slider', minValue: 10, maxValue: 50});