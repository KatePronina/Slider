import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class ConfigurationView extends ComponentView {
  public constructor(state: FullSettings) {
    super(state);
  }
}

export default ConfigurationView;