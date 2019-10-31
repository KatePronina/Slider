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
  private settings: IViewSettings;

  public constructor(settings: IFullSettings) {
    super();
    this.initViews(settings);
    settings.positionLength && this.updateViews(settings.value, settings.positionLength);
  }

  public redrawSlider(newSettings: IModelSettings): void {
    this.settings.$parentElement.html('');
    this.initViews({ ...newSettings, $parentElement: this.settings.$parentElement });
    newSettings.positionLength && this.updateViews(newSettings.value, newSettings.positionLength);
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

  private initViews(settings: IFullSettings): void {
    const { positionLength, $parentElement, ...newSettings } = settings;
    const { direction, minValue, maxValue, value, type, step } = settings;

    if (positionLength) {
      this.initSlider({ positionLength, $parentElement, ...newSettings });
    }

    const slider = $parentElement.find('.slider');

    if (settings.hint) {
      this.initHint({ value, type, direction, $parentElement: slider });
    }

    if (settings.scale) {
      const sliderSize = settings.direction === constants.DIRECTION_HORIZONTAL ?
                          parseInt(`${this.sliderView.$stripElement.outerWidth()}`, 10) :
                          parseInt(`${this.sliderView.$stripElement.outerHeight()}`, 10);
      this.initScale({ sliderSize, direction, minValue, maxValue, step, $parentElement: slider });
    }
  }

  private initSlider = (settings: IViewSettings): void => {
    this.settings = settings;
    const { direction, minValue, maxValue, $parentElement, positionLength } = this.settings;

    switch (this.settings.type) {
      case constants.TYPE_SINGLE:
        this.sliderView = new SingleSliderView({ direction, minValue, maxValue, $parentElement, positionLength });
        break;
      case constants.TYPE_INTERVAL:
        this.sliderView = new IntervalSliderView({ direction, minValue, maxValue, $parentElement, positionLength });
        break;
    }

    this.sliderView.dispatchPositionPercent = (positionPercent: number | number[], valueType?: string): void => {
      this.publish('dispatchOptions', { positionPercent, valueType, eventType: 'positionPercentUpdated' });
    };
  }

  private initHint({ value, type, direction, $parentElement }: IHintSettings): void {
    this.hintView = new HintView({ value, type, direction, $parentElement });

    if (this.settings.type === constants.TYPE_INTERVAL) {
      this.hintMaxValueView = new HintView({ value, type, direction, $parentElement, isMaxValue: true });
    }
  }

  private initScale({ direction, minValue, maxValue, step, sliderSize, $parentElement }: IScaleSettings): void {
    this.scaleView = new ScaleView({ sliderSize, direction, minValue, maxValue, step, $parentElement });

    this.scaleView.dispatchValue = (value: number): void => {
      this.settings.type === constants.TYPE_INTERVAL ?
                            this.publish('dispatchOptions', { value: [value], eventType: 'stateUpdated' })
                            : this.publish('dispatchOptions', { value, eventType: 'stateUpdated' });
    };
  }
}

export default View;
