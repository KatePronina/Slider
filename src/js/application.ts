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

const firstSlider = new Application({parentId: 'first-slider', value: 67});
const secondSlider = new Application({parentId: 'second-slider', minValue: 3, maxValue: 19, step: 5, value: 8, scale: true});
const thirdSlider = new Application({parentId: 'third-slider', minValue: 2, maxValue: 31, step: 8, direction: 'vertical', scale: true});
const fourthSlider = new Application({parentId: 'fourth-slider', type: 'interval', value: [10, 31], direction: 'vertical', scale: true, step: 5});