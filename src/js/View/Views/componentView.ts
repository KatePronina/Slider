import {FullSettings} from '../../application.interfaces';

abstract class ComponentView {
  public state: FullSettings;
  public DOMElement: HTMLElement;

  public constructor(state: FullSettings) {
    this.state = state;
  }

  public getDOMElement(): HTMLElement {
    return this.DOMElement;
  }
}

export default ComponentView;