import Settings from '../application.interfaces';
import RangeSliderView from './Views/rangeSliderView';
import IntervalSliderView from './Views/intervalSliderView';

class View {
  public state: Settings;
  public slider: RangeSliderView | IntervalSliderView;

  public constructor(state: Settings) {
    this.state = state;

    if (this.state.type === 'range') {
      this.slider = new RangeSliderView(this.state);
    } else if (this.state.type === 'interval') {
      this.slider = new IntervalSliderView(this.state);
    }
  }
}

export default View;