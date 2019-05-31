import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class IntervalSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;

  public constructor(state: Settings) {
    super(state);
  }

  public getDOMElement(): HTMLElement {
    return this.sliderDOMElement;
  }
}

export default IntervalSliderView;