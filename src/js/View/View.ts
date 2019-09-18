import IFullSettings from '../Interfaces/IFullSettings';
import IViewSettings from '../Interfaces/view/IViewSettings';
import constants from '../constants';
import Observer from '../Observer/Observer';

import RangeSliderView from './Views/slider/RangeSliderView';
import IntervalSliderView from './Views/slider/IntervalSliderView';
import HintView from './Views/hint/HintView';
import ScaleView from './Views/scale/ScaleView';

class View extends Observer {
  public slider: RangeSliderView | IntervalSliderView;
  public hintView?: HintView;
  public hintMaxValue?: HintView;
  public scaleView?: ScaleView;
  public $parentElement: JQuery;

  private sliderElement: HTMLElement | null;
  private hintElement: HTMLElement;
  private hintMaxValueElement: HTMLElement;
  private scaleElement: HTMLElement;
  private type: string;
  private minValue: number;
  private maxValue: number;
  private value: number | number[];
  private step: number;
  private direction: string;
  private hint: boolean;
  private scale: boolean;
  private positionLength: number | number[];

  public constructor({
    $parentElement,
    type,
    minValue,
    maxValue,
    value,
    step,
    direction,
    hint,
    scale,
    positionLength,
  }: IViewSettings) {
    super();
    this.$parentElement = $parentElement;
    this.type = type;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.value = value;
    this.step = step;
    this.direction = direction;
    this.hint = hint;
    this.scale = scale;
    this.positionLength = positionLength;
    this.initSlider({
      $parentElement: this.$parentElement,
      type: this.type,
      minValue: this.minValue,
      maxValue: this.maxValue,
      value: this.value,
      step: this.step,
      direction: this.direction,
      hint: this.hint,
      scale: this.scale,
    });
  }

  public initSlider = ({
    $parentElement,
    type,
    minValue,
    maxValue,
    value,
    step,
    direction,
    hint,
    scale,
    positionLength,
  }: IFullSettings): void => {
    this.$parentElement = $parentElement;
    this.type = type;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.value = value;
    this.step = step;
    this.direction = direction;
    this.hint = hint;
    this.scale = scale;

    if (positionLength) this.positionLength = positionLength;

    if (this.type === constants.TYPE_RANGE) {
      this.slider = new RangeSliderView({
        direction: this.direction,
        minValue: this.minValue,
        maxValue: this.maxValue,
        value: this.value,
      });
    } else if (this.type === constants.TYPE_INTERVAL) {
      this.slider = new IntervalSliderView({
        direction: this.direction,
        minValue: this.minValue,
        maxValue: this.maxValue,
        value: this.value,
      });
    }

    this.slider.onPositionPercentChange = (positionPercent: number, valueType?: string): void => {
      this.publish('newPositionPercent', positionPercent, valueType);
    };

    this.sliderElement = this.slider.getDOMElement();
    this.appendElementToParent(this.sliderElement);

    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.slider.length = this.sliderElement.offsetHeight;
      this.slider.offset = this.sliderElement.offsetTop;
    } else {
      this.slider.length = this.sliderElement.offsetWidth;
      this.slider.offset = this.sliderElement.offsetLeft;
    }

    if (this.type === constants.TYPE_INTERVAL
        && this.slider instanceof IntervalSliderView
        && this.slider.minPointDOMElement) {
      this.slider.pointWidth = this.slider.minPointDOMElement.offsetWidth;
    } else if (this.slider instanceof RangeSliderView && this.slider.pointDOMElement) {
      this.slider.pointWidth = this.slider.pointDOMElement.offsetWidth;
    }

    this.slider.pointOffset = (this.slider.pointWidth / 2) / this.slider.length;

    if (this.type === constants.TYPE_INTERVAL
        && this.slider instanceof IntervalSliderView
        && this.value instanceof Array
        && this.positionLength instanceof Array) {
      this.slider.onChangedValue(this.value, this.positionLength);
    } else if (this.slider instanceof RangeSliderView
               && typeof this.value === 'number'
               && typeof this.positionLength === 'number') {
      this.slider.onChangedValue(this.positionLength);
    }

    if (this.hint) {
      this.initHint();
    }

    if (this.scale) {
      this.initScale();
    }
  }

  public onChangedValue = (value: number | number[], newPositionLength: number | number[]): void => {
    this.value = value;
    this.positionLength = newPositionLength;

    if (this.type === constants.TYPE_INTERVAL
        && this.slider instanceof IntervalSliderView
        && value instanceof Array
        && newPositionLength instanceof Array) {
      this.slider.onChangedValue(value, newPositionLength);
    } else if (this.slider instanceof RangeSliderView && typeof value === 'number' && typeof newPositionLength === 'number') {
      this.slider.onChangedValue(newPositionLength);
    }

    if (this.hint) {
      if (this.type === constants.TYPE_RANGE && typeof value === 'number' && typeof newPositionLength === 'number') {
        this.hintView && (this.hintView.onChangedValue(value, newPositionLength));
      } else if (value instanceof Array && newPositionLength instanceof Array) {
        this.hintView && (this.hintView.onChangedValue(value, newPositionLength[constants.VALUE_START]));
        this.hintMaxValue && (this.hintMaxValue.onChangedValue(value, newPositionLength[constants.VALUE_END]));
      }
    }
  }

  public remove = (): void => {
    this.$parentElement.html('');
  }

  private appendElementToParent(element: HTMLElement): void {
    this.$parentElement.append(element);
  }

  private appendElementToSlider(element: HTMLElement): void {
    const slider = this.$parentElement.find('.slider');
    slider.append(element);
  }

  private initHint(): void {
    this.hintView = new HintView({ value: this.value, type: this.type, direction: this.direction });
    this.hintElement = this.hintView.getDOMElement();
    this.appendElementToSlider(this.hintElement);

    if (this.direction === constants.DIRECTION_VERTICAL) {
      this.hintView.offset = (this.hintElement.offsetHeight / 2) / this.slider.length;
    } else {
      this.hintView.offset = (this.hintElement.offsetWidth / 2) / this.slider.length;
    }

    if (this.type === constants.TYPE_INTERVAL) {
      this.hintMaxValue = new HintView({
        value: this.value,
        type: this.type,
        direction: this.direction,
        isMaxValue: true,
      });
      this.hintMaxValueElement = this.hintMaxValue.getDOMElement();
      this.appendElementToSlider(this.hintMaxValueElement);

      if (this.direction === constants.DIRECTION_VERTICAL) {
        this.hintMaxValue.offset = (this.hintMaxValueElement.offsetHeight / 2) / this.slider.length;
      } else {
        this.hintMaxValue.offset = (this.hintMaxValueElement.offsetWidth / 2) / this.slider.length;
      }
    }

    if (this.type === constants.TYPE_RANGE
        && typeof this.value === 'number'
        && typeof this.positionLength === 'number') {
      this.hintView.onChangedValue(this.value, this.positionLength);
    } else if (this.value instanceof Array && this.positionLength instanceof Array) {
      this.hintView.onChangedValue(this.value, this.positionLength[constants.VALUE_START]);
      this.hintMaxValue && (this.hintMaxValue).onChangedValue(this.value, this.positionLength[constants.VALUE_END]);
    }
  }

  private initScale(): void {
    const sliderLength = this.slider.stripDOMElement
                         && (this.direction === constants.DIRECTION_HORIZONTAL ?
                          this.slider.stripDOMElement.offsetWidth :
                          this.slider.stripDOMElement.offsetHeight);
    if (sliderLength) {
      this.scaleView = new ScaleView({
        sliderLength,
        direction: this.direction,
        minValue: this.minValue,
        maxValue: this.maxValue,
        step: this.step,
      });
    }

    if (this.scaleView) {
      this.scaleElement = this.scaleView.getDOMElement();
      this.appendElementToSlider(this.scaleElement);
      this.scaleView.alignValues();

      this.scaleView.onNewValue = (value: number): void => {
        this.publish('newValue', value);
      };
    }
  }
}

export default View;
