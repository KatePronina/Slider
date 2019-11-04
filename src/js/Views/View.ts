import IFullSettings from '../Interfaces/IFullSettings';
import { IView, IViewSettings, IHintSettings, IScaleSettings } from '../Interfaces/view/IView';
import { IModelSettings } from '../Interfaces/model/IModel';
import { VALUE_START, VALUE_END, TYPE_SINGLE, TYPE_INTERVAL } from '../constants';
import Observer from '../Observer/Observer';

import SingleSliderView from './slider/SingleSliderView';
import IntervalSliderView from './slider/IntervalSliderView';
import HintView from './hint/HintView';
import ScaleView from './scale/ScaleView';

class View extends Observer implements IView {
  private sliderView: SingleSliderView | IntervalSliderView;
  private hintView?: HintView;
  private hintMaxValueView?: HintView;
  private scaleView?: ScaleView;
  private settings: IViewSettings;

  public constructor(settings: IFullSettings) {
    super();
    this.initViews(settings);
  }

  public redrawSlider(newSettings: IModelSettings): void {
    this.settings.$parentElement.html('');
    this.initViews({ ...newSettings, $parentElement: this.settings.$parentElement });
    newSettings.positionLength && this.changeSlider(newSettings.value, newSettings.positionLength);
  }

  public changeSlider = (value: number | number[], newPositionLength: number[]): void => {
    this.settings.value = value;
    this.settings.positionLength = newPositionLength;

    this.sliderView.updateSlider(newPositionLength);

    if (this.hintView) {
      this.hintView.updateHint(value, newPositionLength[VALUE_START]);
    }

    if (this.hintMaxValueView) {
      this.hintMaxValueView.updateHint(value, newPositionLength[VALUE_END]);
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
      this.initScale({ direction, minValue, maxValue, step, $parentElement: slider });
    }

    if (positionLength) {
      this.changeSlider(value, positionLength);
    }
  }

  private initSlider = (settings: IViewSettings): void => {
    this.settings = settings;
    const { direction, minValue, maxValue, $parentElement, positionLength } = this.settings;

    switch (this.settings.type) {
      case TYPE_SINGLE:
        this.sliderView = new SingleSliderView({ direction, minValue, maxValue, $parentElement, positionLength });
        break;
      case TYPE_INTERVAL:
        this.sliderView = new IntervalSliderView({ direction, minValue, maxValue, $parentElement, positionLength });
        break;
    }

    this.sliderView.dispatchPositionPercent = (positionPercent: number | number[], valueType?: string): void => {
      this.notify('dispatchOptions', { positionPercent, valueType, eventType: 'positionPercentUpdated' });
    };
  }

  private initHint({ value, type, direction, $parentElement }: IHintSettings): void {
    this.hintView = new HintView({ value, type, direction, $parentElement });

    if (this.settings.type === TYPE_INTERVAL) {
      this.hintMaxValueView = new HintView({ value, type, direction, $parentElement, isMaxValue: true });
    }
  }

  private initScale({ direction, minValue, maxValue, step, $parentElement }: IScaleSettings): void {
    this.scaleView = new ScaleView({ direction, minValue, maxValue, step, $parentElement });

    this.scaleView.dispatchValue = (value: number): void => {
      this.settings.type === TYPE_INTERVAL ?
                            this.notify('dispatchOptions', { value: [value], eventType: 'stateUpdated' })
                            : this.notify('dispatchOptions', { value, eventType: 'stateUpdated' });
    };
  }
}

export default View;
