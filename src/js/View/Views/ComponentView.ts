import IComponentView from '../../Interfaces/view/IComponentView';

abstract class ComponentView implements IComponentView{
  public DOMElement: HTMLElement;

  public getDOMElement(): HTMLElement {
    return this.DOMElement;
  }
}

export default ComponentView;
