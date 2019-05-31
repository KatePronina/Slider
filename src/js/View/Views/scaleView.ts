import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class ScaleView extends ComponentView {
  public scaleDOMElement: HTMLElement;

  public constructor(state: Settings) {
    super(state);
  }

  public getDOMElement(): HTMLElement {
    return this.scaleDOMElement;
  }
}

export default ScaleView;