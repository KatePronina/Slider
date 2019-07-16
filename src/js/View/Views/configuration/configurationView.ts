import IFullSettings from '../../../application.interfaces';
import sliderOptions from '../../../sliderOptions';
import ComponentView from '../componentView';

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
    if (this.state.type === sliderOptions.TYPE_RANGE) {
      (this.currentValueInput as HTMLInputElement).value = (value as number).toString();
    } else {
      (this.currentMinValueInput as HTMLInputElement).value = (value as number[])[0].toString();
      (this.currentMaxValueInput as HTMLInputElement).value = (value as number[])[1].toString();
    }
  }

  public onNewValue = (value: number | number[], valueType?: string): void => {}

  public onStepChange = (event: Event): void => {}

  public onMinValueChange = (event: Event): void => {}

  public onMaxValueChange = (event: Event): void => {}

  public onHintChange = (): void => {}

  public onScaleChange = (): void => {}

  public onDirectionChange = (): void => {}

  public onTypeChange = (): void => {}

  public bindEvents(): void {
    if (this.state.type === sliderOptions.TYPE_RANGE) {
      this.bindInputValueEvent((this.currentValueInput as HTMLInputElement));
    } else {
      const minInput = this.currentMinValueInput as HTMLInputElement;
      const maxInput = this.currentMaxValueInput as HTMLInputElement;
      this.bindInputValueEvent(minInput, sliderOptions.VALUE_TYPE_MIN);
      this.bindInputValueEvent(maxInput, sliderOptions.VALUE_TYPE_MAX);
    }

    (this.stepSizeInput as HTMLInputElement).addEventListener('input', this.onStepChange);

    (this.minValueInput as HTMLInputElement).addEventListener('input', this.onMinValueChange);

    (this.maxValueInput as HTMLInputElement).addEventListener('input', this.onMaxValueChange);

    (this.hintToggle as HTMLInputElement).addEventListener('change', this.onHintChange);

    (this.scaleToggle as HTMLInputElement).addEventListener('change', this.onScaleChange);

    (this.verticalToggle as HTMLInputElement).addEventListener('change', this.onDirectionChange);

    (this.typeToggle as HTMLInputElement).addEventListener('change', this.onTypeChange);
  }

  private templateRange =
    '<fieldset class="configuration__fieldset">'
      + '<div class="configuration__value">'
        + '<label class="configuration__label"> Текущее значение'
          + '<input class="configuration__value-input" type="number" id="currentValue" />'
        + '</label>'
      + '</div>'
      + '<div class="configuration__value">'
        + '<label class="configuration__label">Размер шага'
          + '<input class="configuration__value-input" min="1" type="number" id="stepSize" />'
        + '</label>'
      + '</div>'
      + '<div class="configuration__value">'
        + '<label class="configuration__label">Минимальное значение'
          + '<input class="configuration__value-input" type="number" id="minValue" />'
        + '</label>'
      + '</div>'
      + '<div class="configuration__value">'
        + '<label class="configuration__label">Максимальное значение'
          + '<input class="configuration__value-input" type="number" id="maxValue" />'
        + '</label>'
      + '</div>'
    + '</fieldset>'
    + '<fieldset class="configuration__fieldset">'
      + '<div class="configuration__checkbox">'
        + '<label class="configuration__label">Подсказка'
          + '<input class="configuration__checkbox-input" type="checkbox" id="toggleHint" />'
        + '</label>'
      + '</div>'
      + '<div class="configuration__checkbox">'
      + '<label class="configuration__label">Шкала'
        + '<input class="configuration__checkbox-input" type="checkbox" id="toggleScale" />'
        + '</label>'
      + '</div>'
      + '<div class="configuration__checkbox">'
        + '<label class="configuration__label">Два значения'
          + '<input class="configuration__checkbox-input" type="checkbox" id="toggleType" />'
        + '</label>'
      + '</div>'
      + '<div class="configuration__checkbox">'
        + '<label class="configuration__label">Вертикальный вид'
          + '<input class="configuration__checkbox-input" type="checkbox" id="toggleVertical" />'
        + '</label>'
      + '</div>'
    + '</fieldset>';

  private templateInterval =
  '<fieldset class="configuration__fieldset">'
    + '<div class="configuration__value">'
      + '<label class="configuration__label">Текущее минимальное значение'
        + '<input class="configuration__value-input" type="number" id="currentMinValue" />'
      + '</label>'
    + '</div>'
    + '<div class="configuration__value">'
      + '<label class="configuration__label">Текущее максимальное значение'
        + '<input class="configuration__value-input" type="number" id="currentMaxValue" />'
      + '</label>'
    + '</div>'
    + '<div class="configuration__value">'
      + '<label class="configuration__label">Размер шага'
        + '<input class="configuration__value-input" min="1" type="number" id="stepSize" />'
      + '</label>'
    + '</div>'
    + '<div class="configuration__value">'
      + '<label class="configuration__label">Минимальное значение'
        + '<input class="configuration__value-input" type="number" id="minValue" />'
      + '</label>'
    + '</div>'
    + '<div class="configuration__value">'
      + '<label class="configuration__label">Максимальное значение'
        + '<input class="configuration__value-input" type="number" id="maxValue" />'
      + '</label>'
    + '</div>'
  + '</fieldset>'
  + '<fieldset class="configuration__fieldset">'
    + '<div class="configuration__checkbox">'
      + '<label class="configuration__label">Подсказка'
        + '<input class="configuration__checkbox-input" type="checkbox" id="toggleHint" />'
      + '</label>'
    + '</div>'
    + '<div class="configuration__checkbox">'
      + '<label class="configuration__label">Шкала'
        + '<input class="configuration__checkbox-input" type="checkbox" id="toggleScale" />'
      + '</label>'
    + '</div>'
    + '<div class="configuration__checkbox">'
      + '<label class="configuration__label">Два значения'
        + '<input class="configuration__checkbox-input" type="checkbox" id="toggleType" />'
      + '</label>'
    + '</div>'
    + '<div class="configuration__checkbox">'
      + '<label class="configuration__label">Вертикальный вид'
        + '<input class="configuration__checkbox-input" type="checkbox" id="toggleVertical" />'
      + '</label>'
    + '</div>'
  + '</fieldset>';

  private createDOMElement(): void {
    const configurationForm = document.createElement('form');
    configurationForm.classList.add('configuration');

    if (this.state.type === sliderOptions.TYPE_RANGE) {
      configurationForm.innerHTML = this.templateRange;
    } else {
      configurationForm.innerHTML = this.templateInterval;
    }

    this.DOMElement = configurationForm;
    if (this.state.type === sliderOptions.TYPE_RANGE) {
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
    if (this.state.type === sliderOptions.TYPE_RANGE) {
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
    const isInterval = this.state.type === sliderOptions.TYPE_INTERVAL;
    (this.typeToggle as HTMLInputElement).checked = isInterval;
    const isVertical = this.state.direction === sliderOptions.DIRECTION_VERTICAL;
    (this.verticalToggle as HTMLInputElement).checked = isVertical;
  }
}

export default ConfigurationView;
