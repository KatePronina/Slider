import {FullSettings} from '../application.interfaces';

import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';
import HintView from './Views/hintView';
import ScaleView from './Views/scaleView';
import ConfigurationView from './Views/configurationView';

class View {
  public state: FullSettings;
  public sliderElement: HTMLElement | null;
  public hintElement: HTMLElement;
  public hintMaxValueElement: HTMLElement;
  public scaleElement: HTMLElement;
  public configurationDOMElement: HTMLElement;

  public slider: RangeSliderView | IntervalSliderView;
  public hint?: HintView;
  public hintMaxValue?: HintView;
  public scale?: ScaleView;
  public configuration?: ConfigurationView;

  public constructor(state: FullSettings) {
    this.initSlider(state);
  }

  public initSlider(state: FullSettings): void {
    this.state = state;

    if (this.state.type === 'range') {
      this.slider = new RangeSliderView(this.state);
    } else if (this.state.type === 'interval') {
      this.slider = new IntervalSliderView(this.state);
    }

    this.slider.onNewValue = (value: number | number[], valueType?: string): void => {
      this.onNewValue(value, valueType);
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
      this.slider.pointWidth = (((this.slider as RangeSliderView).pointDOMElement as HTMLElement)).offsetWidth;
    }
    
    this.slider.pointOffset = ((this.slider as RangeSliderView).pointWidth / 2) / (this.slider as RangeSliderView).sliderLength;

    if (this.state.type === 'interval') {
      (this.slider as IntervalSliderView).onChangedValue(this.state.value as number[]);
    } else {
      (this.slider as RangeSliderView).onChangedValue(this.state.value as number);
    }

    if (this.state.hint) {
      this.initHint();
    }

    if (this.state.scale) {
      this.initScale();
    }

    if (this.state.configuration) {
      this.configuration = new ConfigurationView(this.state);
      this.configurationDOMElement = this.configuration.getDOMElement();
      this.appendElementToParent(this.configurationDOMElement);

      this.configuration.onNewValue = (value: number | number[], valueType?: string): void => {
        this.onNewValue(value, valueType);
      }

      this.configuration.onStepChange = (newStep: number): void => {
        this.onStateChange({...state, step: newStep});
      }

      this.configuration.onMinValueChange = (newMinValue: number): void => {
        this.onStateChange({...state, minValue: newMinValue});
      }

      this.configuration.onMaxValueChange = (newMaxValue: number): void => {
        this.onStateChange({...state, maxValue: newMaxValue});
      }

      this.configuration.onHintChange = (): void => {
        if (this.state.hint) {
          (this.hint as HintView).toggleDisplay();
          this.state.hint = !this.state.hint;
          if (this.hintMaxValue) {
            this.hintMaxValue.toggleDisplay();
          }
        } else {
          this.initHint();
          this.state.hint = true;
        }
      }

      this.configuration.onScaleChange = (): void => {
        if (this.state.scale) {
          (this.scale as ScaleView).toggleDisplay();
          this.state.scale = !this.state.scale;
        } else {
          this.initScale();
          this.state.scale = true;
        }
      }

      this.configuration.onDirectionChange = (): void => {
        if (this.state.direction === 'horizontal') {
          this.onDirectionChange({...state, direction: 'vertical'});
        } else {
          this.onDirectionChange({...state, direction: 'horizontal'});
        }
      }

      this.configuration.onTypeChange = (): void => {
        if (this.state.type === 'range') {
          this.onStateChange({...state, type: 'interval'});
        } else {
          this.onStateChange({...state, type: 'range'})
        }
      }
    }
  }

  public appendElementToParent(element: HTMLElement): void {
    this.state.parentElement.append(element);
  }

  public appendElementToSlider(element: HTMLElement): void {
    const slider = this.state.parentElement.find('.slider');
    slider.append(element);
  }

  public onChangedValue(value: number | number[]): void {
    this.state.value = value;

    if (this.state.type === 'interval') {
      (this.slider as IntervalSliderView).onChangedValue((value as number[]));
    } else {
      (this.slider as RangeSliderView).onChangedValue((value as number));
    }
    
    if (this.hint) {
      if (this.state.type === 'range') {
        this.hint.onChangedValue(value, (this.slider as RangeSliderView).countLength((value as number)));
      } else {
        this.hint.onChangedValue(value, (this.slider as IntervalSliderView).countLength((value as number[])[0]));
        (this.hintMaxValue as HintView).onChangedValue(value, (this.slider as IntervalSliderView).countLength((value as number[])[1]));
      }
    }

    if (this.configuration) {
      this.configuration.onChangedValue(value);
    }
  }

  private initHint(): void {
    this.hint = new HintView(this.state);
    this.hintElement = this.hint.getDOMElement();
    this.appendElementToSlider(this.hintElement);

    if (this.state.direction === 'vertical') {
      this.hint.offset = (this.hintElement.offsetHeight / 2) / this.slider.sliderLength;
    } else {
      this.hint.offset = (this.hintElement.offsetWidth / 2) / this.slider.sliderLength;
    }

    if (this.state.type === 'interval') {
      this.hintMaxValue = new HintView(this.state, true);
      this.hintMaxValueElement = this.hintMaxValue.getDOMElement();
      this.appendElementToSlider(this.hintMaxValueElement);

      if (this.state.direction === 'vertical') {
        this.hintMaxValue.offset = (this.hintMaxValueElement.offsetHeight / 2) / this.slider.sliderLength;
      } else {
        this.hintMaxValue.offset = (this.hintMaxValueElement.offsetWidth / 2) / this.slider.sliderLength;
      }
    } 

    if (this.state.type === 'interval') {
      this.hint.setStartValueWidth((this.slider as IntervalSliderView).countLength((this.state.value as number[])[0]));
      (this.hintMaxValue as HintView).setStartValueWidth((this.slider as IntervalSliderView).countLength((this.state.value as number[])[1]));
    } else {
      this.hint.setStartValueWidth((this.slider as RangeSliderView).countLength(this.state.value as number));
    } 
  }

  private initScale(): void {
    if (this.state.direction === 'horizontal') {
      this.scale = new ScaleView(this.state, (this.slider.stripDOMElement as HTMLElement).offsetWidth);
    } else {
      this.scale = new ScaleView(this.state, (this.slider.stripDOMElement as HTMLElement).offsetHeight);
    }
    this.scaleElement = this.scale.getDOMElement();
    this.appendElementToSlider(this.scaleElement);
    this.scale.alignValues();
    this.scale.onNewValue = (value: number): void => {
      this.onNewValue(value);
    }
  }

  public remove(): void {
    this.state.parentElement.html('');
  }

  public onNewValue(value: number | number[], valueType?: string): void {

  }

  public onDirectionChange(newState: FullSettings): void {

  }

  public onStateChange(newState: FullSettings): void {

  }
}

export default View;