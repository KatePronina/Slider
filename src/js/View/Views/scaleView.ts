import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class ScaleView extends ComponentView {
  public scaleDOMElement: HTMLElement;

  public constructor(state: FullSettings) {
    super(state);
  }

  public getDOMElement(): HTMLElement {
    return this.scaleDOMElement;
  }
}

export default ScaleView;