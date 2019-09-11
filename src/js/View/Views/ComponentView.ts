abstract class ComponentView {
  public DOMElement: HTMLElement;

  public getDOMElement(): HTMLElement {
    return this.DOMElement;
  }
}

export default ComponentView;
