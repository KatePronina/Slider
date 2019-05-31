import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class HintView extends ComponentView {
  public hintDOMElement: HTMLElement;

  public constructor(state: Settings) {
    super(state);
  }

  public getDOMElement(): HTMLElement {
    return this.hintDOMElement;
  }
}

export default HintView;