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
    } else if (this.state.type === 'interval') {
      this.slider = new IntervalSliderView(this.state);
    }

    this.slider.onNewValue = (value: number | number[]): void => {
      this.onNewValue(value);
    }

    this.sliderElement = this.slider.getDOMElement();
    this.appendElementToParent(this.sliderElement);

    if (this.state.direction === 'vertical') {
      this.slider.sliderLength = this.sliderElement.offsetHeight;
      this.slider.sliderOffset = this.sliderElement.offsetTop;
    } else {
      this.slider.sliderLength = this.sliderElement.offsetWidth;
      this.slider.sliderOffset = this.sliderElement.offsetLeft;
    }

    if (this.state.type === 'interval') {
      this.slider.pointWidth = (((this.slider as IntervalSliderView).minPointDOMElement as HTMLElement)).offsetWidth;
    } else {
      this.slider.pointWidth = (((this.slider as RangeSliderView).sliderPointDOMElement as HTMLElement)).offsetWidth;
    }
    
    this.slider.pointOffset = ((this.slider as RangeSliderView).pointWidth / 2) / (this.slider as RangeSliderView).sliderLength;
    this.slider.setStartValueLength();

    if (this.state.hint) {
      this.hint = new HintView(this.state);
      this.hintElement = this.hint.getDOMElement();
      this.appendElementToSlider(this.hintElement);
      if (this.state.direction === 'vertical') {
        this.hint.hintOffset = (this.hintElement.offsetHeight / 2) / (this.slider as RangeSliderView).sliderLength;
      } else {
        this.hint.hintOffset = (this.hintElement.offsetWidth / 2) / (this.slider as RangeSliderView).sliderLength;
      }
      this.hint.setStartValueWidth((this.slider as RangeSliderView).startValueLength());
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

    if (this.state.type === 'interval') {
      (this.slider as IntervalSliderView).onChangedValue((value as number[]));
    } else {
      (this.slider as RangeSliderView).onChangedValue((value as number));
    }
    
    if (this.hint) {
      this.hint.onChangedValue(value, (this.slider as RangeSliderView).countWidth((value as number)));
    }
  }

  public onNewValue(value: number | number[]): void {

  }
}

export default View;