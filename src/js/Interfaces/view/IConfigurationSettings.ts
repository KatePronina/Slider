export default interface IConfigurationSettings {
  type: string;
  value: number | number[];
  minValue: number;
  maxValue: number;
  hint: boolean;
  scale: boolean;
  direction: string;
  step: number;
}
