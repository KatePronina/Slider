import DEFAULT_SETTINGS from './defaultSettings';
import Settings from '../application.interfaces';

class Model {
  public state: Settings;

  public constructor(settings: Settings) {
    this.state = {parentId: settings.parentId};
    this.state.type = settings.type || DEFAULT_SETTINGS.TYPE;
    this.state.minValue = settings.minValue || DEFAULT_SETTINGS.MIN_VALUE;
    this.state.maxValue = settings.maxValue || DEFAULT_SETTINGS.MAX_VALUE;
    this.state.value = settings.value || this.state.minValue;
    this.state.step = settings.step || DEFAULT_SETTINGS.STEP;
    this.state.direction = settings.direction || DEFAULT_SETTINGS.DIRECTION;
    this.state.hint = settings.hint || DEFAULT_SETTINGS.HINT;
    this.state.scale = settings.scale || DEFAULT_SETTINGS.SCALE;
    this.state.configure = settings.configure || DEFAULT_SETTINGS.CONFIGURE;
  }
}

export default Model;