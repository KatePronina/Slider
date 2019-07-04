import ComponentView from './componentView';
import {FullSettings} from '../../application.interfaces';

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

  public constructor(state: FullSettings) {
    super(state);
    this.createDOMElement();
  }

  private templateRange = 
    '<fieldset class="configuration__fieldset">' +
      '<div class="configuration__value">' +
        '<label class="configuration__label"> Текущее значение' +
          `<input class="configuration__value-input" type="number" step="${this.state.step}" id="currentValue" />` +
        '</label>' +
      '</div>' +
      '<div class="configuration__value">' +
        '<label class="configuration__label">Размер шага' +
          '<input class="configuration__value-input" type="number" id="stepSize" />' +
        '</label>' +
      '</div>' +
      '<div class="configuration__value">' +
        '<label class="configuration__label">Минимальное значение' +
          '<input class="configuration__value-input" type="number" id="minValue" />' +
        '</label>' +
      '</div>' +
      '<div class="configuration__value">' +
        '<label class="configuration__label">Максимальное значение' +
          '<input class="configuration__value-input" type="number" id="maxValue" />' +
        '</label>' +
      '</div>' +
    '</fieldset>' +
    '<fieldset class="configuration__fieldset">' +
      '<div class="configuration__checkbox">' +
        '<label class="configuration__label">Подсказка' +
          '<input class="configuration__checkbox-input" type="checkbox" id="toggleHint" />' +
        '</label>' +
      '</div>' +
      '<div class="configuration__checkbox">' +
        '<label class="configuration__label">Шкала' +
          '<input class="configuration__checkbox-input" type="checkbox" id="toggleScale" />' +
        '</label>' +
      '</div>' +
      '<div class="configuration__checkbox">' +
        '<label class="configuration__label">Два значения' +
          '<input class="configuration__checkbox-input" type="checkbox" id="toggleType" />' +
        '</label>' +
      '</div>' +
      '<div class="configuration__checkbox">' +
        '<label class="configuration__label">Вертикальный вид' +
          '<input class="configuration__checkbox-input" type="checkbox" id="toggleVertical" />' +
        '</label>' +
      '</div>' +
    '</fieldset>';

  private templateInterval = 
  '<fieldset class="configuration__fieldset">' +
    '<div class="configuration__value">' +
      '<label class="configuration__label">Текущее минимальное значение' +
        `<input class="configuration__value-input" type="number" step="${this.state.step}" id="currentMinValue" />` +
      '</label>' +
    '</div>' +
    '<div class="configuration__value">' +
      '<label class="configuration__label">Текущее максимальное значение' +
        `<input class="configuration__value-input" type="number" step="${this.state.step}" id="currentMaxValue" />` +
      '</label>' +
    '</div>' +
    '<div class="configuration__value">' +
      '<label class="configuration__label">Размер шага' +
        '<input class="configuration__value-input" type="number" id="stepSize" />' +
      '</label>' +
    '</div>' +
    '<div class="configuration__value">' +
      '<label class="configuration__label">Минимальное значение' +
        '<input class="configuration__value-input" type="number" id="minValue" />' +
      '</label>' +
    '</div>' +
    '<div class="configuration__value">' +
      '<label class="configuration__label">Максимальное значение' +
        '<input class="configuration__value-input" type="number" id="maxValue" />' +
      '</label>' +
    '</div>' +
  '</fieldset>' +
  '<fieldset class="configuration__fieldset">' +
    '<div class="configuration__checkbox">' +
      '<label class="configuration__label">Подсказка' +
        '<input class="configuration__checkbox-input" type="checkbox" id="toggleHint" />' +
      '</label>' +
    '</div>' +
    '<div class="configuration__checkbox">' +
      '<label class="configuration__label">Шкала' +
        '<input class="configuration__checkbox-input" type="checkbox" id="toggleScale" />' +
      '</label>' +
    '</div>' +
    '<div class="configuration__checkbox">' +
      '<label class="configuration__label">Два значения' +
        '<input class="configuration__checkbox-input" type="checkbox" id="toggleType" />' +
      '</label>' +
    '</div>' +
    '<div class="configuration__checkbox">' +
      '<label class="configuration__label">Вертикальный вид' +
        '<input class="configuration__checkbox-input" type="checkbox" id="toggleVertical" />' +
      '</label>' +
    '</div>' +
  '</fieldset>';

  public createDOMElement(): void {
    const configurationForm = document.createElement('form');
    configurationForm.classList.add('configuration');

    if(this.state.type === 'range') {
      configurationForm.innerHTML = this.templateRange;
    } else {
      configurationForm.innerHTML = this.templateInterval;
    }
    
    this.DOMElement = configurationForm;
    if(this.state.type === 'range') {
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

    this.bindEvents();
    this.setStartValues();
  }

  public onChangedValue(value: number | number[]): void {
    if (this.state.type === 'range') {
      (this.currentValueInput as HTMLInputElement).value = (value as number).toString();
    } else {
      (this.currentMinValueInput as HTMLInputElement).value = (value as number[])[0].toString();
      (this.currentMaxValueInput as HTMLInputElement).value = (value as number[])[1].toString();
    }
  }

  public onNewValue(value: number | number[], valueType?: string): void {

  }

  private bindEvents(): void {
    if (this.state.type === 'range') {
      this.bindInputEvent((this.currentValueInput as HTMLInputElement));
    } else {
      this.bindInputEvent((this.currentMinValueInput as HTMLInputElement), 'min');
      this.bindInputEvent((this.currentMaxValueInput as HTMLInputElement), 'max');
    }

  }

  private bindInputEvent(input: HTMLInputElement, valueType?: string): void {
    input.addEventListener('input', (): void => {
      setTimeout((): void => {
        if (input.value.length === 0) {
          this.onNewValue(this.state.minValue);
        } else if (valueType) {
          this.onNewValue(parseInt(input.value), valueType);
        } else {
          this.onNewValue(parseInt(input.value));
        }
      }, 800)
    })
  }

  private setStartValues(): void {
    if (this.state.type === 'range') {
      (this.currentValueInput as HTMLInputElement).value = (this.state.value as number).toString();
    } else {
      (this.currentMinValueInput as HTMLInputElement).value = (this.state.value as number[])[0].toString();
      (this.currentMaxValueInput as HTMLInputElement).value = (this.state.value as number[])[1].toString();
    }
    (this.stepSizeInput as HTMLInputElement).value = (this.state.step).toString();
    (this.minValueInput as HTMLInputElement).value = (this.state.minValue).toString();
    (this.maxValueInput as HTMLInputElement).value = (this.state.maxValue).toString();
    (this.hintToggle as HTMLInputElement).checked = this.state.hint;
    (this.scaleToggle as HTMLInputElement).checked = this.state.scale;
    (this.typeToggle as HTMLInputElement).checked = this.state.type === 'range'? false : true;
    (this.verticalToggle as HTMLInputElement).checked = this.state.direction === 'horizontal'? false : true;
  }
}

export default ConfigurationView;