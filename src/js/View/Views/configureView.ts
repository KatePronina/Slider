import ComponentView from './componentView';
import Settings from '../../application.interfaces';

class ConfigureView extends ComponentView {
  public constructor(state: Settings) {
    super(state);
  }
}

export default ConfigureView;