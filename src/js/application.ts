import Settings from './application.interfaces';

class Application {
  public constructor(settings: Settings) {
    this.createSlider(settings);
  }

  public createSlider(settings: Settings): void {
    const model: Model = new Model(settings);
    const controller: Controller = new Controller(model);
  }
}