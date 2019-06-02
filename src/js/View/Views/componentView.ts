import {FullSettings} from '../../application.interfaces';

abstract class ComponentView {
  public state: FullSettings;

  public constructor(state: FullSettings) {
    this.state = state;
  }

  public abstract getDOMElement(): HTMLElement;
}

export default ComponentView;