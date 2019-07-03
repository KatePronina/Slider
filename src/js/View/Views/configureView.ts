import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

class ConfigureView extends ComponentView {
  public constructor(state: FullSettings) {
    super(state);
  }
}

export default ConfigureView;