import IFullSettings from '../Interfaces/IFullSettings';
import IView from '../Interfaces/view/IView';
import IViewSettings from '../Interfaces/view/IViewSettings';
import IHintSettings from '../Interfaces/view/IHintSettings';
import constants from '../constants';
import Observer from '../Observer/Observer';

import SingleSliderView from './slider/SingleSliderView';
import IntervalSliderView from './slider/IntervalSliderView';
import HintView from './hint/HintView';
import ScaleView from './scale/ScaleView';
import IScaleSettings from '../Interfaces/view/IScaleSettings';
import IModelSettings from '../Interfaces/model/IModelSettings';

class View extends Observer implements IView {
  private sliderView: SingleSliderView | IntervalSliderView;
  private hintView?: HintView;
  private hintMaxValueView?: HintView;
  private scaleView?: ScaleView;
  private $sliderElement: JQuery<HTMLDivElement>;
  private hintElement: HTMLElement;
  private hintMaxValueElement: HTMLElement;
  private scaleElement: HTMLElement;
  private settings: IViewSettings;

  public constructor(settings: IFullSettings) {
    super();
    this.initViews(settings);
  }

  public redrawSlider(newSettings: IModelSettings): void {
    this.settings.$parentElement.html('');
    this.initViews({ ...newSettings, $parentElement: this.settings.$parentElement });
  }

  public updateViews = (value: number | number[], newPositionLength: number[]): void => {
    this.settings.value = value;
    this.settings.positionLength = newPositionLength;

    this.sliderView.update(newPositionLength);

    if (this.hintView) {
      this.hintView.update(value, newPositionLength[constants.VALUE_START]);
    }

    if (this.hintMaxValueView) {
      this.hintMaxValueView.update(value, newPositionLength[constants.VALUE_END]);
    }
  }

  private insertElementToSlider(element: HTMLElement): void {
    const slider = this.settings.$parentElement.find('.slider');
    slider.append(element);
  }

  private initViews(settings: IFullSettings): void {
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
                          parseInt(`${this.sliderView.$stripElement.outerWidth()}`, 10) :
                          parseInt(`${this.sliderView.$stripElement.outerHeight()}`, 10);
      this.initScale({ sliderLength, direction, minValue, maxValue, step });
    }
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

    this.$sliderElement = this.sliderView.$sliderElement;
    this.settings.$parentElement.append(this.$sliderElement);
    this.sliderView.setSliderSizes();
    this.sliderView.update(this.settings.positionLength);
    this.subscribeSliderView();
  }

  private subscribeSliderView(): void {
    this.sliderView.dispatchPositionPercent = (positionPercent: number | number[], valueType?: string): void => {
      this.publish('dispatchOptions', { positionPercent, valueType, eventType: 'positionPercentUpdated' });
    };
  }

  private initHint({ value, type, direction }: IHintSettings): void {
    this.hintView = new HintView({ value, type, direction });
    this.hintElement = this.hintView.getElement();
    this.insertElementToSlider(this.hintElement);
    this.hintView.setOffset(this.sliderView.length);

    if (this.settings.type === constants.TYPE_INTERVAL) {
      this.hintMaxValueView = new HintView({ value, type, direction, isMaxValue: true });
      this.hintMaxValueElement = this.hintMaxValueView.getElement();
      this.insertElementToSlider(this.hintMaxValueElement);
      this.hintMaxValueView.setOffset(this.sliderView.length);
    }

    this.hintView.update(this.settings.value, this.settings.positionLength[constants.VALUE_START]);
    this.hintMaxValueView &&
      this.hintMaxValueView.update(this.settings.value, this.settings.positionLength[constants.VALUE_END]);
  }

  private initScale({ direction, minValue, maxValue, step, sliderLength }: IScaleSettings): void {
    this.scaleView = new ScaleView({ sliderLength, direction, minValue, maxValue, step });
    this.scaleElement = this.scaleView.getElement();
    this.insertElementToSlider(this.scaleElement);
    this.scaleView.alignValueElements();

    this.scaleView.dispatchValue = (value: number): void => {
      this.settings.type === constants.TYPE_INTERVAL ?
                            this.publish('dispatchOptions', { value: [value], eventType: 'stateUpdated' })
                            : this.publish('dispatchOptions', { value, eventType: 'stateUpdated' });
    };
  }
}

export default View;
