import Settings from '../application.interfaces';
import RangeSliderView from './Views/rangeSliderView';

class View {
  public state: Settings;
  public slider: RangeSliderView;

  public constructor(state: Settings) {
    this.state = state;

    if (this.state.type === 'range') {
      this.slider = new RangeSliderView(this.state);
    }
  }
}

export default View;