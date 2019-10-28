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
  private sliderElement: JQuery<HTMLDivElement>;
  private hintElement: HTMLElement;
  private hintMaxValueElement: HTMLElement;
  private scaleElement: HTMLElement;
  private settings: IViewSettings;

  public constructor(settings: IFullSettings) {
    super();
    this.initViews(settings);
  }

  public initViews(settings: IFullSettings): void {
    settings.$parentElement.html('');

    const { positionLength, ...newSettings } = settings;
    const { direction, minValue, maxValue, value, type, step } = settings;

    if (positionLength) {
      this.initSlider({ positionLength, ...newSettings });
    }

    if (settings.hint) {
      this.initHint({ value, type, direction });
    }

    if (settings.scale) {
      const sliderLength = settings.direction === constants.DIRECTION_HORIZONTAL ?
                          parseInt(`${this.sliderView.stripDOMElement.outerWidth()}`, 10) :
                          parseInt(`${this.sliderView.stripDOMElement.outerHeight()}`, 10);
      this.initScale({ sliderLength, direction, minValue, maxValue, step });
    }
  }

  public updateViews = (value: number | number[], newPositionLength: number[]): void => {
    this.settings.value = value;
    this.settings.positionLength = newPositionLength;

    this.sliderView.update(newPositionLength);
    this.settings.hint && this.notifyHintOfNewValue(value, newPositionLength);
  }

  public getParentElement(): JQuery {
    return this.settings.$parentElement;
  }

  private initSlider = (settings: IViewSettings): void => {
    this.settings = settings;
    const { direction, minValue, maxValue } = this.settings;

    switch (this.settings.type) {
      case constants.TYPE_SINGLE:
        this.sliderView = new SingleSliderView({ direction, minValue, maxValue });
        break;
      case constants.TYPE_INTERVAL:
        this.sliderView = new IntervalSliderView({ direction, minValue, maxValue });
        break;
    }

    this.sliderElement = this.sliderView.sliderElement;
    this.insertElementToParent(this.sliderElement);
    this.sliderView.setSliderSizes();
    this.sliderView.update(this.settings.positionLength);
    this.bindEventsToSlider();
  }

  private bindEventsToSlider(): void {
    this.sliderView.onPositionPercentChange = (positionPercent: number | number[], valueType?: string): void => {
      this.publish('dispatchNewSettings', { positionPercent, valueType }, 'positionPercentUpdated');
    };
  }

  private notifyHintOfNewValue(value: number | number[], newPositionLength: number[]): void {
    if (this.settings.type === constants.TYPE_SINGLE && typeof value === 'number') {
      this.hintView && (this.hintView.update(value, newPositionLength[constants.VALUE_START]));
    } else if (value instanceof Array) {
      this.hintView && (this.hintView.update(value, newPositionLength[constants.VALUE_START]));
      this.hintMaxValueView && (this.hintMaxValueView.update(value, newPositionLength[constants.VALUE_END]));
    }
  }

  private insertElementToParent(element: JQuery<HTMLDivElement>): void {
    this.settings.$parentElement.append(element);
  }

  private insertElementToSlider(element: HTMLElement): void {
    const slider = this.settings.$parentElement.find('.slider');
    slider.append(element);
  }

  private initHint({ value, type, direction }: IHintSettings): void {
    this.hintView = new HintView({ value, type, direction });
    this.hintElement = this.hintView.getDOMElement();
    this.insertElementToSlider(this.hintElement);
    this.hintView.setSizes(this.sliderView.length);

    if (this.settings.type === constants.TYPE_INTERVAL) {
      this.hintMaxValueView = new HintView({ value, type, direction, isMaxValue: true });
      this.hintMaxValueElement = this.hintMaxValueView.getDOMElement();
      this.insertElementToSlider(this.hintMaxValueElement);
      this.hintMaxValueView.setSizes(this.sliderView.length);
    }

    this.hintView.update(this.settings.value, this.settings.positionLength[constants.VALUE_START]);
    this.hintMaxValueView &&
      this.hintMaxValueView.update(this.settings.value, this.settings.positionLength[constants.VALUE_END]);
  }

  private initScale({ direction, minValue, maxValue, step, sliderLength }: IScaleSettings): void {
    this.scaleView = new ScaleView({ sliderLength, direction, minValue, maxValue, step });
    this.scaleElement = this.scaleView.getDOMElement();
    this.insertElementToSlider(this.scaleElement);
    this.scaleView.alignValues();

    this.scaleView.onNewValue = (value: number): void => {
      this.settings.type === constants.TYPE_INTERVAL ?
                            this.publish('dispatchNewSettings', { value: [value] }, 'stateUpdated')
                            : this.publish('dispatchNewSettings', { value }, 'stateUpdated');
    };
  }
}

export default View;
