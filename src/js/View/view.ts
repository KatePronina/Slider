import Settings from '../application.interfaces';

class View {
  public state: Settings;

  public constructor(state: Settings) {
      this.state = state;
  }
}

export default View;