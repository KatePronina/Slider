import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class IntervalSliderView extends ComponentView {
  public sliderDOMElement: HTMLElement;

  public constructor(state: FullSettings) {
    super(state);
  }

  public getDOMElement(): HTMLElement {
    return this.sliderDOMElement;
  }
}

export default IntervalSliderView;