import { IModelSettings } from '../model/IModel';

export interface IView {
  changeSlider(value: number | number[], newPositionLength: number | number[]): void;
  redrawSlider(newSettings: IModelSettings): void;
}

export interface IViewSettings {
  $parentElement: JQuery;
  type: 'single' | 'interval';
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  direction: 'horizontal' | 'vertical';
  hint: boolean;
  scale: boolean;
  positionLength: number[];
  positionPercent?: number | number[];
  valueType?: string;
}

export interface ISliderSettings {
  minValue: number;
  maxValue: number;
  positionLength: number[];
  $parentElement: JQuery<HTMLElement>;
  direction: 'horizontal' | 'vertical';
}

export interface ISingleSliderView {
  updateSlider(newPositionLength: number[]): void;
  dispatchPositionPercent(positionPercent: number): void;
}

export interface IScaleView {
  dispatchValue(value: number): void;
}

export interface IScaleSettings {
  minValue: number;
  maxValue: number;
  step: number;
  direction: 'horizontal' | 'vertical';
  $parentElement: JQuery<HTMLElement>;
}

export interface IIntervalSliderView {
  updateSlider(value: number[], newPositionLength: number[]): void;
  dispatchPositionPercent(positionPercent: number[], valueType: string): void;
}

export interface IHintView {
  updateHint(value: number[], percent: number): void;
}

export interface IHintSettings {
  value: number[];
  type: 'single' | 'interval';
  direction: 'horizontal' | 'vertical';
  isMaxValue?: boolean;
  $parentElement: JQuery<HTMLElement>;
}
