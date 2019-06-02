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

    if (this.state.hint === 'yes') {
      this.hint = new HintView(this.state);
      this.hintElement = this.hint.getDOMElement();
      this.appendElementToSlider(this.hintElement);
    }

    if (this.state.scale === 'yes') {
      this.scale = new ScaleView(this.state);
    }

    if (this.state.configure === 'yes') {
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

  public onNewValue(value: number): void {

  }
}

export default View;