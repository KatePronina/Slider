import IComponentView from '../Interfaces/view/IComponentView';

abstract class ComponentView implements IComponentView {
  public element: HTMLElement;

  public getDOMElement(): HTMLElement {
    return this.element;
  }
}

export default ComponentView;
