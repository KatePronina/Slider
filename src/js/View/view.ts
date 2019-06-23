import {FullSettings} from '../application.interfaces';

import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';
import HintView from './Views/hintView';
import ScaleView from './Views/scaleView';
import ConfigureView from './Views/configureView';

class View {
  public state: FullSettings;
  public parentElement: HTMLElement | null;
  public sliderElement: HTMLElement | null;
  public hintElement: HTMLElement;

  public slider: RangeSliderView | IntervalSliderView;
  public hint?: HintView;
  public scale?: ScaleView;
  public configure?: ConfigureView;

  public constructor(state: FullSettings) {
    this.state = state;
    
    this.parentElement = document.getElementById(state.parentId);

    if (this.state.type === 'range') {
      this.slider = new RangeSliderView(this.state);
      (this.slider as RangeSliderView).onNewValue = (value): void => {
        this.onNewValue(value);
      }
    } else if (this.state.type === 'interval') {
      this.slider = new IntervalSliderView(this.state);
    }

    this.sliderElement = this.slider.getDOMElement();
    this.appendElementToParent(this.sliderElement);
    (this.slider as RangeSliderView).sliderWidth = this.sliderElement.offsetWidth;
    (this.slider as RangeSliderView).sliderOffsetLeft = this.sliderElement.offsetLeft;
    (this.slider as RangeSliderView).pointWidth = (((this.slider as RangeSliderView).sliderPointDOMElement as HTMLElement)).offsetWidth;
    (this.slider as RangeSliderView).pointOffset = ((this.slider as RangeSliderView).pointWidth / 2) / (this.slider as RangeSliderView).sliderWidth;
    (this.slider as RangeSliderView).setStartValueWidth();

    if (this.state.hint) {
      this.hint = new HintView(this.state);
      this.hintElement = this.hint.getDOMElement();
      this.appendElementToSlider(this.hintElement);
      this.hint.hintOffset = (this.hintElement.offsetWidth / 2) / (this.slider as RangeSliderView).sliderWidth;
      this.hint.setStartValueWidth((this.slider as RangeSliderView).startValueWidth());
    }

    if (this.state.scale) {
      this.scale = new ScaleView(this.state);
    }

    if (this.state.configure) {
      this.configure = new ConfigureView(this.state);
    }
  }

  public appendElementToParent(element: HTMLElement): void {
    (this.parentElement as HTMLElement).appendChild(element);
  }

  public appendElementToSlider(element: HTMLElement): void {
    const slider = (this.parentElement as HTMLElement).querySelector('.slider');
    (slider as HTMLElement).appendChild(element);
  }

  public onChangedValue(value: number | number[]): void {
    this.state.value = value;

    (this.slider as RangeSliderView).onChangedValue((value as number));
    if (this.hint) {
      this.hint.onChangedValue(value, (this.slider as RangeSliderView).countWidth((value as number)));
    }
  }

  public onNewValue(value: number): void {

  }
}

export default View;