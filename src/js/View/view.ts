import IFullSettings from '../IFullSettings';
import constants from '../constants';

import RangeSliderView from './Views/slider/RangeSliderView';
import IntervalSliderView from './Views/slider/IntervalSliderView';
import HintView from './Views/hint/HintView';
import ScaleView from './Views/scale/ScaleView';
import ConfigurationView from './Views/configuration/ConfigurationView';

class View {
  public state: IFullSettings;

  public slider: RangeSliderView | IntervalSliderView;

  public hint?: HintView;

  public hintMaxValue?: HintView;

  public scale?: ScaleView;

  public configuration?: ConfigurationView;

  private sliderElement: HTMLElement | null;

  private hintElement: HTMLElement;

  private hintMaxValueElement: HTMLElement;

  private scaleElement: HTMLElement;

  private configurationElement: HTMLElement;

  public constructor(state: IFullSettings) {
    this.initSlider(state);
  }

  public initSlider(state: IFullSettings): void {
    this.state = state;

    if (this.state.type === constants.TYPE_RANGE) {
      this.slider = new RangeSliderView(this.state);
    } else if (this.state.type === constants.TYPE_INTERVAL) {
      this.slider = new IntervalSliderView(this.state);
    }

    this.slider.onNewValue = (value: number | number[], valueType?: string): void => {
      this.onNewValue(value, valueType);
    };

    this.sliderElement = this.slider.getDOMElement();
    this.appendElementToParent(this.sliderElement);

    if (this.state.direction === constants.DIRECTION_VERTICAL) {
      this.slider.length = this.sliderElement.offsetHeight;
      this.slider.offset = this.sliderElement.offsetTop;
    } else {
      this.slider.length = this.sliderElement.offsetWidth;
      this.slider.offset = this.sliderElement.offsetLeft;
    }

    if (this.state.type === constants.TYPE_INTERVAL) {
      const point = (this.slider as IntervalSliderView).minPointDOMElement;
      this.slider.pointWidth = (point as HTMLElement).offsetWidth;
    } else {
      const point = (this.slider as RangeSliderView).pointDOMElement;
      this.slider.pointWidth = (point as HTMLElement).offsetWidth;
    }

    this.slider.pointOffset = (this.slider.pointWidth / 2) / this.slider.length;

    if (this.state.type === constants.TYPE_INTERVAL) {
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
      this.initConfiguration();
    }
  }

  public onChangedValue(value: number | number[]): void {
    this.state.value = value;

    if (this.state.type === constants.TYPE_INTERVAL) {
      (this.slider as IntervalSliderView).onChangedValue((value as number[]));
    } else {
      (this.slider as RangeSliderView).onChangedValue((value as number));
    }

    if (this.hint) {
      if (this.state.type === constants.TYPE_RANGE) {
        const length = this.slider.countLength((value as number));
        this.hint.onChangedValue(value, length);
      } else {
        const length = this.slider.countLength((value as number[])[constants.VALUE_START]);
        this.hint.onChangedValue(value, length);
        const maxLength = this.slider.countLength((value as number[])[constants.VALUE_END]);
        (this.hintMaxValue as HintView).onChangedValue(value, maxLength);
      }
    }

    if (this.configuration) {
      this.configuration.onChangedValue(value);
    }
  }

  public remove(): void {
    this.state.$parentElement.html('');
  }

  public onNewValue = (value: number | number[], valueType?: string): void => {}

  public onDirectionChange = (newState: IFullSettings): void => {}

  public onStateChange = (newState: IFullSettings): void => {}

  private appendElementToParent(element: HTMLElement): void {
    this.state.$parentElement.append(element);
  }

  private appendElementToSlider(element: HTMLElement): void {
    const slider = this.state.$parentElement.find('.slider');
    slider.append(element);
  }

  private initHint(): void {
    this.hint = new HintView(this.state);
    this.hintElement = this.hint.getDOMElement();
    this.appendElementToSlider(this.hintElement);

    if (this.state.direction === constants.DIRECTION_VERTICAL) {
      this.hint.offset = (this.hintElement.offsetHeight / 2) / this.slider.length;
    } else {
      this.hint.offset = (this.hintElement.offsetWidth / 2) / this.slider.length;
    }

    if (this.state.type === constants.TYPE_INTERVAL) {
      this.hintMaxValue = new HintView(this.state, true);
      this.hintMaxValueElement = this.hintMaxValue.getDOMElement();
      this.appendElementToSlider(this.hintMaxValueElement);

      if (this.state.direction === constants.DIRECTION_VERTICAL) {
        this.hintMaxValue.offset = (this.hintMaxValueElement.offsetHeight / 2) / this.slider.length;
      } else {
        this.hintMaxValue.offset = (this.hintMaxValueElement.offsetWidth / 2) / this.slider.length;
      }
    }

    if (this.state.type === constants.TYPE_RANGE) {
      const length = this.slider.countLength(this.state.value as number);
      this.hint.onChangedValue((this.state.value as number), length);
    } else {
      const maxValue = (this.state.value as number[])[constants.VALUE_END];
      const minValue = (this.state.value as number[])[constants.VALUE_START];
      const maxLength = this.slider.countLength(maxValue);
      const minLength = this.slider.countLength(minValue);
      this.hint.onChangedValue((this.state.value as number[]), minLength);
      (this.hintMaxValue as HintView).onChangedValue((this.state.value as number[]), maxLength);
    }
  }

  private initScale(): void {
    if (this.state.direction === constants.DIRECTION_HORIZONTAL) {
      const width = (this.slider.stripDOMElement as HTMLElement).offsetWidth;
      this.scale = new ScaleView(this.state, width);
    } else {
      const height = (this.slider.stripDOMElement as HTMLElement).offsetHeight;
      this.scale = new ScaleView(this.state, height);
    }
    this.scaleElement = this.scale.getDOMElement();
    this.appendElementToSlider(this.scaleElement);
    this.scale.alignValues();

    this.scale.onNewValue = (value: number): void => {
      this.onNewValue(value);
    };
  }

  private initConfiguration(): void {
    this.configuration = new ConfigurationView(this.state);
    this.configurationElement = this.configuration.getDOMElement();
    this.appendElementToParent(this.configurationElement);

    this.configuration.onNewValue = (value: number | number[], valueType?: string): void => {
      this.onNewValue(value, valueType);
    };

    this.configuration.onStepChange = (event: Event): void => {
      if (parseInt((event.target as HTMLInputElement).value, 10) > 0) {
        const newStep = parseInt((event.target as HTMLInputElement).value, 10);
        this.onStateChange({ ...this.state, step: newStep });
      }
    };

    this.configuration.onMinValueChange = (event: Event): void => {
      if ((event.target as HTMLInputElement).value.length > 0) {
        const newMinValue = parseInt((event.target as HTMLInputElement).value, 10);
        this.onStateChange({ ...this.state, minValue: newMinValue });
      }
    };

    this.configuration.onMaxValueChange = (event: Event): void => {
      if ((event.target as HTMLInputElement).value.length > 0) {
        const newMaxValue = parseInt((event.target as HTMLInputElement).value, 10);
        this.onStateChange({ ...this.state, maxValue: newMaxValue });
      }
    };

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
    };

    this.configuration.onScaleChange = (): void => {
      if (this.state.scale) {
        (this.scale as ScaleView).toggleDisplay();
        this.state.scale = !this.state.scale;
      } else {
        this.initScale();
        this.state.scale = true;
      }
    };

    this.configuration.onDirectionChange = (): void => {
      if (this.state.direction === constants.DIRECTION_HORIZONTAL) {
        this.onDirectionChange({ ...this.state, direction: constants.DIRECTION_VERTICAL });
      } else {
        this.onDirectionChange({ ...this.state, direction: constants.DIRECTION_HORIZONTAL });
      }
    };

    this.configuration.onTypeChange = (): void => {
      if (this.state.type === constants.TYPE_RANGE) {
        this.onStateChange({ ...this.state, type: constants.TYPE_INTERVAL });
      } else {
        this.onStateChange({ ...this.state, type: constants.TYPE_RANGE });
      }
    };

    this.configuration.bindEvents();
  }
}

export default View;
