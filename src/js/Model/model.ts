import DEFAULT_SETTINGS from './defaultSettings';
import Settings from '../application.interfaces';

class Model {
  public readonly parentId: string;
  public readonly type: string;
  public minValue: number;
  public maxValue: number;
  public value: number | number[];
  public step: number;
  public direction: string;
  public hint: string;
  public configure: string;

  public constructor(settings: Settings) {
    this.parentId = settings.parentId;
    this.type = settings.type || DEFAULT_SETTINGS.TYPE;
    this.minValue = settings.minValue || DEFAULT_SETTINGS.MIN_VALUE;
    this.maxValue = settings.maxValue || DEFAULT_SETTINGS.MAX_VALUE;
    this.value = settings.value || this.minValue;
    this.step = settings.step || DEFAULT_SETTINGS.STEP;
    this.direction = settings.direction || DEFAULT_SETTINGS.DIRECTION;
    this.hint = settings.hint || DEFAULT_SETTINGS.HINT;
    this.configure = settings.configure || DEFAULT_SETTINGS.CONFIGURE;
  }
}

export default Model;