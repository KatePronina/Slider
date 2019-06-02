import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class ConfigureView extends ComponentView {
  public configureDOMElement: HTMLElement;

  public constructor(state: FullSettings) {
    super(state);
  }

  public getDOMElement(): HTMLElement {
    return this.configureDOMElement;
  }
}

export default ConfigureView;