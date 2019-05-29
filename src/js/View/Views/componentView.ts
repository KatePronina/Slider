import Settings from '../../application.interfaces';

abstract class ComponentView {
  public state: Settings;
  protected template: string;

  public constructor(state: Settings) {
    this.state = state;
  }

  public getTemplate(): string {
    return this.template;
  }
}

export default ComponentView;