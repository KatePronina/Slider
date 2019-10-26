import IFullSettings from '../Interfaces/IFullSettings';
import IView from '../Interfaces/view/IView';
import constants from '../constants';
import Observer from '../Observer/Observer';

import SingleSliderView from './Views/slider/SingleSliderView';
import IntervalSliderView from './Views/slider/IntervalSliderView';
import HintView from './Views/hint/HintView';
import ScaleView from './Views/scale/ScaleView';

class View extends Observer implements IView {
  private sliderView: SingleSliderView | IntervalSliderView;
  private hintView?: HintView;
  private hintMaxValueView?: HintView;
  private scaleView?: ScaleView;
  private $parentElement: JQuery;
  private sliderElement: HTMLElement | null;
  private hintElement: HTMLElement;
  private hintMaxValueElement: HTMLElement;
  private scaleElement: HTMLElement;
  private type: 'single' | 'interval';
  private minValue: number;
  private maxValue: number;
  private value: number | number[];
  private step: number;
  private direction: 'horizontal' | 'vertical';
  private hint: boolean;
  private scale: boolean;
  private positionLength: number | number[];

  public constructor(settings: IFullSettings) {
    super();
    this.initSlider(settings);
  }

  public initSlider = (settings: IFullSettings): void => {
    this.saveSettings(settings);

    if (this.type === constants.TYPE_SINGLE) {
      this.sliderView = new SingleSliderView({
        direction: this.direction,
        minValue: this.minValue,
        maxValue: this.maxValue,
        value: this.value,
      });
    } else if (this.type === constants.TYPE_INTERVAL) {
      this.sliderView = new IntervalSliderView({
        direction: this.direction,
        minValue: this.minValue,
        maxValue: this.maxValue,
        value: this.value,
      });
    }

    this.bindEventsToSlider();
    this.appendSlider();
    this.setSliderSizes();
    this.setStartedValues();

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

    this.notifySliderOfNewValue(value, newPositionLength);

    if (this.hint) {
      this.notifyHintOfNewValue(value, newPositionLength);
    }
  }

  public remove = (): void => {
    this.$parentElement.html('');
  }

  public getParentElement(): JQuery {
    return this.$parentElement;
  }

  private saveSettings(settings: IFullSettings): void {
    this.$parentElement = settings.$parentElement;
    this.type = settings.type;
    this.minValue = settings.minValue;
    this.maxValue = settings.maxValue;
    this.value = settings.value;
    this.step = settings.step;
    this.direction = settings.direction;
    this.hint = settings.hint;
    this.scale = settings.scale;
    if (typeof settings.positionLength !== 'undefined') {
      this.positionLength = settings.positionLength;
    }
  }

  private bindEventsToSlider(): void {
    this.sliderView.onPositionPercentChange = (positionPercent: number | number[], valueType?: string): void => {
      this.publish('settingsUpdated', { positionPercent, valueType }, 'positionPercentUpdated');
    };
  }

  private appendSlider(): void {
    this.sliderElement = this.sliderView.getDOMElement();
    this.appendElementToParent(this.sliderElement);
  }

  private setSliderSizes(): void {
    if (this.direction === constants.DIRECTION_VERTICAL && this.sliderElement) {
      this.sliderView.length = this.sliderElement.offsetHeight;
      this.sliderView.offset = this.sliderElement.offsetTop;
    } else if (this.sliderElement) {
      this.sliderView.length = this.sliderElement.offsetWidth;
      this.sliderView.offset = this.sliderElement.offsetLeft;
    }

    if (this.type === constants.TYPE_INTERVAL
        && this.sliderView instanceof IntervalSliderView
        && this.sliderView.minPointDOMElement) {
      this.sliderView.pointWidth = this.sliderView.minPointDOMElement.offsetWidth;
    } else if (this.sliderView instanceof SingleSliderView && this.sliderView.pointDOMElement) {
      this.sliderView.pointWidth = this.sliderView.pointDOMElement.offsetWidth;
    }

    this.sliderView.pointOffset = (this.sliderView.pointWidth / 2) / this.sliderView.length;
  }

  private setStartedValues(): void {
    if (this.type === constants.TYPE_INTERVAL
        && this.sliderView instanceof IntervalSliderView
        && this.value instanceof Array
        && this.positionLength instanceof Array) {
      this.sliderView.onChangedValue(this.value, this.positionLength);
    } else if (this.sliderView instanceof SingleSliderView
              && typeof this.value === 'number'
              && typeof this.positionLength === 'number') {
      this.sliderView.onChangedValue(this.positionLength);
    }
  }

  private notifySliderOfNewValue(value: number | number[], newPositionLength: number | number[]): void {
    if (this.type === constants.TYPE_INTERVAL
        && this.sliderView instanceof IntervalSliderView
        && value instanceof Array
        && newPositionLength instanceof Array) {
      this.sliderView.onChangedValue(value, newPositionLength);
    } else if (this.sliderView instanceof SingleSliderView && typeof value === 'number' && typeof newPositionLength === 'number') {
      this.sliderView.onChangedValue(newPositionLength);
    }
  }

  private notifyHintOfNewValue(value: number | number[], newPositionLength: number | number[]): void {
    if (this.type === constants.TYPE_SINGLE && typeof value === 'number' && typeof newPositionLength === 'number') {
      this.hintView && (this.hintView.onChangedValue(value, newPositionLength));
    } else if (value instanceof Array && newPositionLength instanceof Array) {
      this.hintView && (this.hintView.onChangedValue(value, newPositionLength[constants.VALUE_START]));
      this.hintMaxValueView && (this.hintMaxValueView.onChangedValue(value, newPositionLength[constants.VALUE_END]));
    }
  }

  private appendElementToParent(element: HTMLElement): void {
    this.$parentElement.append(element);
  }

  private appendElementToSlider(element: HTMLElement): void {
    const slider = this.$parentElement.find('.slider');
    slider.append(element);
  }

  private initHint(): void {
    this.hintView = new HintView({
      value: this.value,
      type: this.type,
      direction: this.direction,
    });

    this.hintElement = this.appendHint(this.hintView);
    this.setHintSizes();

    if (this.type === constants.TYPE_INTERVAL) {
      this.initHintMaxValue();
    }

    this.setStartValuesToHint();
  }

  private appendHint(hintView: HintView): HTMLElement {
    const hintElement = hintView.getDOMElement();
    this.appendElementToSlider(hintElement);
    return hintElement;
  }

  private setHintSizes(): void {
    if (this.direction === constants.DIRECTION_VERTICAL && this.hintView) {
      this.hintView.offset = (this.hintElement.offsetHeight / 2) / this.sliderView.length;
    } else if (this.hintView) {
      this.hintView.offset = (this.hintElement.offsetWidth / 2) / this.sliderView.length;
    }
  }

  private initHintMaxValue(): void {
    this.hintMaxValueView = new HintView({
      value: this.value,
      type: this.type,
      direction: this.direction,
      isMaxValue: true,
    });

    this.hintMaxValueElement = this.appendHint(this.hintMaxValueView);

    if (this.hintView) {
      this.hintMaxValueView.offset = this.hintView.offset;
    }
  }

  private setStartValuesToHint(): void {
    if (this.type === constants.TYPE_SINGLE
        && typeof this.value === 'number'
        && typeof this.positionLength === 'number'
        && this.hintView) {
      this.hintView.onChangedValue(this.value, this.positionLength);
    } else if (this.value instanceof Array
               && this.positionLength instanceof Array
               && this.hintView) {
      this.hintView.onChangedValue(this.value, this.positionLength[constants.VALUE_START]);
      this.hintMaxValueView
        && (this.hintMaxValueView).onChangedValue(this.value, this.positionLength[constants.VALUE_END]);
    }
  }

  private initScale(): void {
    const sliderLength = this.sliderView.stripDOMElement
                         && (this.direction === constants.DIRECTION_HORIZONTAL ?
                          this.sliderView.stripDOMElement.offsetWidth :
                          this.sliderView.stripDOMElement.offsetHeight);
    if (sliderLength) {
      this.scaleView = new ScaleView({
        sliderLength,
        direction: this.direction,
        minValue: this.minValue,
        maxValue: this.maxValue,
        step: this.step,
      });
    }

    this.appendScale();
    this.bindEventsToScale();
  }

  private appendScale(): void {
    if (this.scaleView) {
      this.scaleElement = this.scaleView.getDOMElement();
      this.appendElementToSlider(this.scaleElement);
      this.scaleView.alignValues();
    }
  }

  private bindEventsToScale(): void {
    if (this.scaleView) {
      this.scaleView.onNewValue = (value: number): void => {
        if (this.type === constants.TYPE_INTERVAL) {
          this.publish('settingsUpdated', { value: [value] }, 'stateChanged');
        } else {
          this.publish('settingsUpdated', { value }, 'stateChanged');
        }
      };
    }
  }
}

export default View;
