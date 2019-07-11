import { IFullSettings } from '../../application.interfaces';

abstract class ComponentView {
  public state: IFullSettings;

  public DOMElement: HTMLElement;

  public constructor(state: IFullSettings) {
    this.state = state;
  }

  public getDOMElement(): HTMLElement {
    return this.DOMElement;
  }
}

export default ComponentView;
