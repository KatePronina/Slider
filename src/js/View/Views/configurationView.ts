import ComponentView from './componentView';
import { IFullSettings } from '../../application.interfaces';
import sliderOptions from '../../sliderOptions';

class ConfigurationView extends ComponentView {
  public currentValueInput: HTMLInputElement | null;

  public currentMinValueInput: HTMLInputElement | null;

  public currentMaxValueInput: HTMLInputElement | null;

  public stepSizeInput: HTMLInputElement | null;

  public minValueInput: HTMLInputElement | null;

  public maxValueInput: HTMLInputElement | null;

  public hintToggle: HTMLInputElement | null;

  public scaleToggle: HTMLInputElement | null;

  public typeToggle: HTMLInputElement | null;

  public verticalToggle: HTMLInputElement | null;

  public constructor(state: IFullSettings) {
    super(state);
    this.createDOMElement();
  }

  private templateRange =
    '<fieldset class="configuration__fieldset">'
      + '<div class="configuration__value">'
        + '<label class="configuration__label"> Текущее значение'
          + `<input class="configuration__value-input" type="number" step="${this.state.step}" id="currentValue" />`
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
        + `<input class="configuration__value-input" type="number" step="${this.state.step}" id="currentMinValue" />`
      + '</label>'
    + '</div>'
    + '<div class="configuration__value">'
      + '<label class="configuration__label">Текущее максимальное значение'
        + `<input class="configuration__value-input" type="number" step="${this.state.step}" id="currentMaxValue" />`
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

  public createDOMElement(): void {
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

  public onChangedValue(value: number | number[]): void {
    if (this.state.type === sliderOptions.TYPE_RANGE) {
      (this.currentValueInput as HTMLInputElement).value = (value as number).toString();
    } else {
      (this.currentMinValueInput as HTMLInputElement).value = (value as number[])[0].toString();
      (this.currentMaxValueInput as HTMLInputElement).value = (value as number[])[1].toString();
    }
  }

  public onNewValue = (value: number | number[], valueType?: string): void => {

  }

  public onStepChange = (newStep: number): void => {

  }

  public onMinValueChange = (newMinValue: number): void => {

  }

  public onMaxValueChange = (newMaxValue: number): void => {

  }

  public onHintChange = (): void => {

  }

  public onScaleChange = (): void => {

  }

  public onDirectionChange = (): void => {

  }

  public onTypeChange = (): void => {

  }

  public bindEvents(): void {
    if (this.state.type === sliderOptions.TYPE_RANGE) {
      this.bindInputValueEvent((this.currentValueInput as HTMLInputElement));
    } else {
      this.bindInputValueEvent((this.currentMinValueInput as HTMLInputElement), sliderOptions.VALUE_TYPE_MIN);
      this.bindInputValueEvent((this.currentMaxValueInput as HTMLInputElement), sliderOptions.VALUE_TYPE_MAX);
    }

    (this.stepSizeInput as HTMLInputElement).addEventListener('input', (): void => {
      if (parseInt((this.stepSizeInput as HTMLInputElement).value, 10) > 0) {
        this.onStepChange(parseInt((this.stepSizeInput as HTMLInputElement).value, 10));
      }
    });

    (this.minValueInput as HTMLInputElement).addEventListener('input', (): void => {
      if ((this.minValueInput as HTMLInputElement).value.length > 0) {
        this.onMinValueChange(parseInt((this.minValueInput as HTMLInputElement).value, 10));
      }
    });

    (this.maxValueInput as HTMLInputElement).addEventListener('input', (): void => {
      if ((this.maxValueInput as HTMLInputElement).value.length > 0) {
        this.onMaxValueChange(parseInt((this.maxValueInput as HTMLInputElement).value, 10));
      }
    });

    (this.hintToggle as HTMLInputElement).addEventListener('change', this.onHintChange);

    (this.scaleToggle as HTMLInputElement).addEventListener('change', this.onScaleChange);

    (this.verticalToggle as HTMLInputElement).addEventListener('change', this.onDirectionChange);

    (this.typeToggle as HTMLInputElement).addEventListener('change', this.onTypeChange);
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
    (this.typeToggle as HTMLInputElement).checked = this.state.type === sliderOptions.TYPE_INTERVAL;
    (this.verticalToggle as HTMLInputElement).checked = this.state.direction === sliderOptions.DIRECTION_VERTICAL;
  }
}

export default ConfigurationView;
