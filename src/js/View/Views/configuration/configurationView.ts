import IFullSettings from '../../../IFullSettings';
import constants from '../../../constants';
import ComponentView from '../ComponentView';

class ConfigurationView extends ComponentView {
  private currentValueInput: HTMLInputElement | null;

  private currentMinValueInput: HTMLInputElement | null;

  private currentMaxValueInput: HTMLInputElement | null;

  private stepSizeInput: HTMLInputElement | null;

  private minValueInput: HTMLInputElement | null;

  private maxValueInput: HTMLInputElement | null;

  private hintToggle: HTMLInputElement | null;

  private scaleToggle: HTMLInputElement | null;

  private typeToggle: HTMLInputElement | null;

  private verticalToggle: HTMLInputElement | null;

  private state: IFullSettings;

  public constructor(state: IFullSettings) {
    super();
    this.state = state;
    this.createDOMElement();
  }

  public onChangedValue(value: number | number[]): void {
    if (this.state.type === constants.TYPE_RANGE) {
      (this.currentValueInput as HTMLInputElement).value = (value as number).toString();
    } else {
      (this.currentMinValueInput as HTMLInputElement).value = (value as number[])[0].toString();
      (this.currentMaxValueInput as HTMLInputElement).value = (value as number[])[1].toString();
    }
  }

  public onNewValue = (value: number | number[], valueType?: string): void => {};

  public onStepChange = (event: Event): void => {};

  public onMinValueChange = (event: Event): void => {};

  public onMaxValueChange = (event: Event): void => {};

  public onHintChange = (): void => {};

  public onScaleChange = (): void => {};

  public onDirectionChange = (): void => {};

  public onTypeChange = (): void => {};

  public bindEvents(): void {
    if (this.state.type === constants.TYPE_RANGE) {
      this.bindInputValueEvent((this.currentValueInput as HTMLInputElement));
    } else {
      const minInput = this.currentMinValueInput as HTMLInputElement;
      const maxInput = this.currentMaxValueInput as HTMLInputElement;
      this.bindInputValueEvent(minInput, constants.VALUE_TYPE_MIN);
      this.bindInputValueEvent(maxInput, constants.VALUE_TYPE_MAX);
    }

    (this.stepSizeInput as HTMLInputElement).addEventListener('input', this.onStepChange);

    (this.minValueInput as HTMLInputElement).addEventListener('input', this.onMinValueChange);

    (this.maxValueInput as HTMLInputElement).addEventListener('input', this.onMaxValueChange);

    (this.hintToggle as HTMLInputElement).addEventListener('change', this.onHintChange);

    (this.scaleToggle as HTMLInputElement).addEventListener('change', this.onScaleChange);

    (this.verticalToggle as HTMLInputElement).addEventListener('change', this.onDirectionChange);

    (this.typeToggle as HTMLInputElement).addEventListener('change', this.onTypeChange);
  }

  private templateRange = require('./templates/range.hbs');

  private templateInterval = require('./templates/interval.hbs');

  private createDOMElement(): void {
    const configurationForm = document.createElement('form');
    configurationForm.classList.add('configuration');

    if (this.state.type === constants.TYPE_RANGE) {
      configurationForm.innerHTML = this.templateRange();
    } else {
      configurationForm.innerHTML = this.templateInterval();
    }

    this.DOMElement = configurationForm;
    if (this.state.type === constants.TYPE_RANGE) {
      this.currentValueInput = this.DOMElement.querySelector('#currentValue');
    } else {
      this.currentMinValueInput = this.DOMElement.querySelector('#currentMinValue');
      this.currentMaxValueInput = this.DOMElement.querySelector('#currentMaxValue');
    }
    this.stepSizeInput = this.DOMElement.querySelector('#stepSize');
    this.minValueInput = this.DOMElement.querySelector('#minValue');
    this.maxValueInput = this.DOMElement.querySelector('#maxValue');
    this.hintToggle = this.DOMElement.querySelector('#toggleHint');
    this.scaleToggle = this.DOMElement.querySelector('#toggleScale');
    this.typeToggle = this.DOMElement.querySelector('#toggleType');
    this.verticalToggle = this.DOMElement.querySelector('#toggleVertical');

    this.setStartValues();
  }

  private bindInputValueEvent(input: HTMLInputElement, valueType?: string): void {
    input.addEventListener('input', (): void => {
      setTimeout((): void => {
        if (input.value.length === 0) {
          this.onNewValue(this.state.minValue);
        } else if (valueType) {
          this.onNewValue(parseInt(input.value, 10), valueType);
        } else {
          this.onNewValue(parseInt(input.value, 10));
        }
      }, 800);
    });
  }

  private setStartValues(): void {
    if (this.state.type === constants.TYPE_RANGE) {
      const value = (this.state.value as number).toString();
      (this.currentValueInput as HTMLInputElement).value = value;
    } else {
      const minValue = (this.state.value as number[])[0].toString();
      const maxValue = (this.state.value as number[])[1].toString();
      (this.currentMinValueInput as HTMLInputElement).value = minValue;
      (this.currentMaxValueInput as HTMLInputElement).value = maxValue;
    }
    (this.stepSizeInput as HTMLInputElement).value = (this.state.step).toString();
    (this.minValueInput as HTMLInputElement).value = (this.state.minValue).toString();
    (this.maxValueInput as HTMLInputElement).value = (this.state.maxValue).toString();
    (this.hintToggle as HTMLInputElement).checked = this.state.hint;
    (this.scaleToggle as HTMLInputElement).checked = this.state.scale;
    const isInterval = this.state.type === constants.TYPE_INTERVAL;
    (this.typeToggle as HTMLInputElement).checked = isInterval;
    const isVertical = this.state.direction === constants.DIRECTION_VERTICAL;
    (this.verticalToggle as HTMLInputElement).checked = isVertical;
  }
}

export default ConfigurationView;
