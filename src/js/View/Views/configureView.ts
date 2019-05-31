import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class ConfigureView extends ComponentView {
  public configureDOMElement: HTMLElement;

  public constructor(state: Settings) {
    super(state);
  }

  public getDOMElement(): HTMLElement {
    return this.configureDOMElement;
  }
}

export default ConfigureView;