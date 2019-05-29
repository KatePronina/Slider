import Settings from '../application.interfaces';

import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';
import HintView from './Views/hintView';
import ScaleView from './Views/scaleView';

class View {
  public state: Settings;
  public slider: RangeSliderView | IntervalSliderView;
  public hint?: HintView;
  public scale?: ScaleView;

  public constructor(state: Settings) {
    this.state = state;

    if (this.state.type === 'range') {
      this.slider = new RangeSliderView(this.state);
    } else if (this.state.type === 'interval') {
      this.slider = new IntervalSliderView(this.state);
    }

    if (this.state.hint === 'yes') {
      this.hint = new HintView(this.state);
    }

    if (this.state.scale === 'yes') {
      this.scale = new ScaleView(this.state);
    }
  }
}

export default View;