import IFullSettings from '../Interfaces/IFullSettings';
import IView from '../Interfaces/view/IView';
import IViewSettings from '../Interfaces/view/IViewSettings';
import IHintSettings from '../Interfaces/view/IHintSettings';
import constants from '../constants';
import Observer from '../Observer/Observer';

import SingleSliderView from './Views/slider/SingleSliderView';
import IntervalSliderView from './Views/slider/IntervalSliderView';
import HintView from './Views/hint/HintView';
import ScaleView from './Views/scale/ScaleView';
import IScaleSettings from '../Interfaces/view/IScaleSettings';

class View extends Observer implements IView {
  private sliderView: SingleSliderView | IntervalSliderView;
  private hintView?: HintView;
  private hintMaxValueView?: HintView;
  private scaleView?: ScaleView;
  private sliderElement: HTMLElement | null;
  private hintElement: HTMLElement;
  private hintMaxValueElement: HTMLElement;
  private scaleElement: HTMLElement;
  private settings: IViewSettings;

  public constructor(settings: IFullSettings) {
    super();
    const { positionLength, ...newSettings } = settings;
    positionLength && this.initSlider({ positionLength, ...newSettings });
  }

  public initSlider = (settings: IViewSettings): void => {
    this.settings = settings;
    const { direction, minValue, maxValue, value, type, step } = this.settings;

    switch (this.settings.type) {
      case constants.TYPE_SINGLE:
        this.sliderView = new SingleSliderView({ direction, minValue, maxValue });
        break;
      case constants.TYPE_INTERVAL:
        this.sliderView = new IntervalSliderView({ direction, minValue, maxValue });
        break;
    }

    this.appendSlider();
    this.sliderView.setSliderSizes();
    this.sliderView.onChangedValue(this.settings.positionLength);
    this.bindEventsToSlider();

    this.settings.hint && this.initHint({ value, type, direction });
    const sliderLength = this.sliderView.stripDOMElement
                         && (this.settings.direction === constants.DIRECTION_HORIZONTAL ?
                          this.sliderView.stripDOMElement.offsetWidth :
                          this.sliderView.stripDOMElement.offsetHeight);
    this.settings.scale && sliderLength && this.initScale({ sliderLength, direction, minValue, maxValue, step });
  }

  public onChangedValue = (value: number | number[], newPositionLength: number[]): void => {
    this.settings.value = value;
    this.settings.positionLength = newPositionLength;

    this.notifySliderOfNewValue(newPositionLength);

    this.settings.hint && this.notifyHintOfNewValue(value, newPositionLength);
  }

  public remove = (): void => {
    this.settings.$parentElement.html('');
  }

  public getParentElement(): JQuery {
    return this.settings.$parentElement;
  }

  private bindEventsToSlider(): void {
    this.sliderView.onPositionPercentChange = (positionPercent: number | number[], valueType?: string): void => {
      this.publish('dispatchNewSettings', { positionPercent, valueType }, 'positionPercentUpdated');
    };
  }

  private appendSlider(): void {
    this.sliderElement = this.sliderView.getDOMElement();
    this.appendElementToParent(this.sliderElement);
  }

  private notifySliderOfNewValue(newPositionLength: number[]): void {
    this.sliderView.onChangedValue(newPositionLength);
  }

  private notifyHintOfNewValue(value: number | number[], newPositionLength: number[]): void {
    if (this.settings.type === constants.TYPE_SINGLE && typeof value === 'number') {
      this.hintView && (this.hintView.onChangedValue(value, newPositionLength[constants.VALUE_START]));
    } else if (value instanceof Array) {
      this.hintView && (this.hintView.onChangedValue(value, newPositionLength[constants.VALUE_START]));
      this.hintMaxValueView && (this.hintMaxValueView.onChangedValue(value, newPositionLength[constants.VALUE_END]));
    }
  }

  private appendElementToParent(element: HTMLElement): void {
    this.settings.$parentElement.append(element);
  }

  private appendElementToSlider(element: HTMLElement): void {
    const slider = this.settings.$parentElement.find('.slider');
    slider.append(element);
  }

  private initHint({ value, type, direction }: IHintSettings): void {
    this.hintView = new HintView({ value, type, direction });
    this.hintElement = this.hintView.getDOMElement();
    this.appendElementToSlider(this.hintElement);
    this.hintView.setSizes(this.sliderView.length);

    if (this.settings.type === constants.TYPE_INTERVAL) {
      this.hintMaxValueView = new HintView({ value, type, direction, isMaxValue: true });
      this.hintMaxValueElement = this.hintMaxValueView.getDOMElement();
      this.appendElementToSlider(this.hintMaxValueElement);
      this.hintMaxValueView.setSizes(this.sliderView.length);
    }

    this.hintView.onChangedValue(this.settings.value, this.settings.positionLength[constants.VALUE_START]);
    this.hintMaxValueView &&
      this.hintMaxValueView.onChangedValue(this.settings.value, this.settings.positionLength[constants.VALUE_END]);
  }

  private initScale({ direction, minValue, maxValue, step, sliderLength }: IScaleSettings): void {
    this.scaleView = new ScaleView({ sliderLength, direction, minValue, maxValue, step });
    this.scaleElement = this.scaleView.getDOMElement();
    this.appendElementToSlider(this.scaleElement);
    this.scaleView.alignValues();

    this.scaleView.onNewValue = (value: number): void => {
      this.settings.type === constants.TYPE_INTERVAL ?
                            this.publish('dispatchNewSettings', { value: [value] }, 'stateUpdated')
                            : this.publish('dispatchNewSettings', { value }, 'stateUpdated');
    };
  }
}

export default View;
