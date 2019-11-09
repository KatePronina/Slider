import { IConfigurationView } from './interfaces';
import '../js/plugin';
import { DIRECTION_VERTICAL, TYPE_SINGLE, TYPE_INTERVAL,
        VALUE_START, VALUE_END, DIRECTION_HORIZONTAL, inputsContext } from '../js/constants';
import { IModelSettings } from '../js/Interfaces/model/IModel';
import { INewParams } from '../js/Interfaces/controller/IController';

class ConfigurationView implements IConfigurationView {
  private $containerElement: JQuery<Element>;
  private $sliderParentElement: JQuery<Element>;
  private sliderPlugin: any;
  private settings: IModelSettings;

  private $currentValueInput: JQuery<Element>;
  private $currentMinValueInput: JQuery<Element>;
  private $currentMaxValueInput: JQuery<Element>;
  private $stepSizeInput: JQuery<Element>;
  private $minValueInput: JQuery<Element>;
  private $maxValueInput: JQuery<Element>;
  private $hintToggle: JQuery<Element>;
  private $scaleToggle: JQuery<Element>;
  private $typeToggle: JQuery<Element>;
  private $verticalToggle: JQuery<Element>;

  public constructor(containerElement: Element, sliderClass: string, settings: INewParams = {}) {
    this.$containerElement = $(containerElement);
    this.$sliderParentElement = $(`.${sliderClass}`);

    this.sliderPlugin = $(`.${sliderClass}`).slider({ ...settings, events: {
      valueUpdated: this.updateValueInputs,
      settingsUpdated: this.redrawConfiguration,
    }});
  }

  public updateValueInputs = (value: number[]): void => {
    if (this.settings.type === TYPE_SINGLE) {
      this.$currentValueInput.val(value[VALUE_START].toString());
    } else {
      this.$currentMinValueInput.val(value[VALUE_START].toString());
      this.$currentMaxValueInput.val(value[VALUE_END].toString());
    }
    this.settings.value = value;
  }

  public redrawConfiguration = (settings: IModelSettings): void => {
    this.settings = settings;
    this.removeConfiguration();
    this.renderConfiguration();
    this.updateInputs();
    this.subscribeEventsToInputs();
  }

  private template = require('./templates/template.hbs');

  private renderConfiguration(): void {
    this.drawConfigurationTemplate();

    if (this.settings.type === TYPE_SINGLE) {
      this.$currentValueInput = this.$containerElement.find('.js-configuration__value-input_type_current-value');
    } else {
      this.$currentMinValueInput = this.$containerElement.find('.js-configuration__value-input_type_current-min-value');
      this.$currentMaxValueInput = this.$containerElement.find('.js-configuration__value-input_type_current-max-value');
    }
    this.$stepSizeInput = this.$containerElement.find('.js-configuration__value-input_type_step');
    this.$minValueInput = this.$containerElement.find('.js-configuration__value-input_type_min-value');
    this.$maxValueInput = this.$containerElement.find('.js-configuration__value-input_type_max-value');
    this.$hintToggle = this.$containerElement.find('.js-configuration__value-input_type_hint');
    this.$scaleToggle = this.$containerElement.find('.js-configuration__value-input_type_scale');
    this.$typeToggle = this.$containerElement.find('.js-configuration__value-input_type_toggle-interval');
    this.$verticalToggle = this.$containerElement.find('.js-configuration__value-input_type_vertical');

    if (this.settings.direction === DIRECTION_VERTICAL) {
      this.$sliderParentElement.addClass('slider-section__slider_direction_vertical');
    }
  }

  private drawConfigurationTemplate(): void {
    inputsContext.isSingle = this.settings.type === TYPE_SINGLE;
    this.$containerElement.html(this.template(inputsContext));
  }

  private updateInputs(): void {
    if (this.settings.type === TYPE_SINGLE) {
      this.$currentValueInput.val(this.settings.value[VALUE_START].toString());
    } else {
      this.$currentMinValueInput.val(this.settings.value[VALUE_START].toString());
      this.$currentMaxValueInput.val(this.settings.value[VALUE_END].toString());
    }

    this.$stepSizeInput.val(this.settings.step.toString());
    this.$minValueInput.val(this.settings.minValue.toString());
    this.$maxValueInput.val(this.settings.maxValue.toString());
    this.$hintToggle.prop('checked', this.settings.hint);
    this.$scaleToggle.prop('checked', this.settings.scale);
    this.$typeToggle.prop('checked', this.settings.type === TYPE_INTERVAL);
    this.$verticalToggle.prop('checked', this.settings.direction === DIRECTION_VERTICAL);
  }

  private subscribeEventsToInputs(): void {
    if (this.settings.type === TYPE_SINGLE) {
      this.$currentValueInput.on('blur', this.handleCurrentValueBlur);
    } else {
      this.$currentMinValueInput.on('blur', this.handleCurrentMinValueBlur);
      this.$currentMaxValueInput.on('blur', this.handleCurrentMaxValueBlur);
    }

    this.$stepSizeInput.on('blur', this.handleStepInput);
    this.$minValueInput.on('blur', this.handleMinValueInput);
    this.$maxValueInput.on('blur', this.handleMaxValueInput);
    this.$hintToggle.on('change', this.handleHintChange);
    this.$scaleToggle.on('change', this.handleScaleChange);
    this.$verticalToggle.on('change', this.handleDirectionChange);
    this.$typeToggle.on('change', this.handleTypeChange);
  }

  private removeConfiguration(): void {
    this.$containerElement.html('');
  }

  private handleCurrentValueBlur = ({ target }: Event) => {
    const value = parseInt((<HTMLInputElement>target).value, 10);
    this.sliderPlugin.setSettings({ value: [value] });
  }

  private handleCurrentMinValueBlur = ({ target }: Event) => {
    const value = parseInt((<HTMLInputElement>target).value, 10);
    this.sliderPlugin.setSettings({ value: [value, this.settings.value[VALUE_END]] });
  }

  private handleCurrentMaxValueBlur = ({ target }: Event) => {
    const value = parseInt((<HTMLInputElement>target).value, 10);
    this.sliderPlugin.setSettings({ value: [this.settings.value[VALUE_START], value] });
  }

  private handleStepInput = ({ target }: Event): void => {
    if ((<HTMLInputElement>target).value.length > 0) {
      this.sliderPlugin.setSettings({ step: parseInt((<HTMLInputElement>target).value, 10) });
    }
  }

  private handleMinValueInput = ({ target }: Event): void => {
    if ((<HTMLInputElement>target).value.length > 0) {
      this.sliderPlugin.setSettings({ minValue: parseInt((<HTMLInputElement>target).value, 10) });
    }
  }

  private handleMaxValueInput = ({ target }: Event): void => {
    if ((<HTMLInputElement>target).value.length > 0) {
      this.sliderPlugin.setSettings({ maxValue: parseInt((<HTMLInputElement>target).value, 10) });
    }
  }

  private handleHintChange = (): void => {
    this.sliderPlugin.setSettings({ hint: !this.settings.hint });
  }

  private handleScaleChange = (): void => {
    this.sliderPlugin.setSettings({ scale: !this.settings.scale });
  }

  private handleDirectionChange = (): void => {
    const newDirection = this.settings.direction === DIRECTION_HORIZONTAL ?
                                                      DIRECTION_VERTICAL :
                                                      DIRECTION_HORIZONTAL;

    newDirection === DIRECTION_VERTICAL ?
                      this.$sliderParentElement.addClass('slider-section__slider_direction_vertical')
                    : this.$sliderParentElement.removeClass('slider-section__slider_direction_vertical');

    this.sliderPlugin.setSettings({ direction: newDirection });
  }

  private handleTypeChange = (): void => {
    const currentType = this.settings.type === TYPE_SINGLE ?
                                            TYPE_INTERVAL :
                                            TYPE_SINGLE;
    this.sliderPlugin.setSettings({ type: currentType });
  }
}

export default ConfigurationView;
