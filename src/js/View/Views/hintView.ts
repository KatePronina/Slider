import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class HintView extends ComponentView {
  public hintDOMElement: HTMLElement;

  public constructor(state: Settings) {
    super(state);
    this.createHintDOMElement();
  }

  public createHintDOMElement(): void {
    const hintElement = document.createElement('div');
    hintElement.classList.add('slider__hint'); // TO DO: add binding events
    this.hintDOMElement = hintElement;
  }

  public getDOMElement(): HTMLElement {
    return this.hintDOMElement;
  }
}

export default HintView;