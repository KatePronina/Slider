import Settings from '../../application.interfaces';

abstract class ComponentView {
  public state: Settings;

  public constructor(state: Settings) {
    this.state = state;
  }

  public abstract getDOMElement(): HTMLElement;
}

export default ComponentView;