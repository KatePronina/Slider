export default interface IFullSettings {
  $parentElement: JQuery;
  type: string;
  minValue: number;
  maxValue: number;
  value: number | number[];
  step: number;
  direction: string;
  hint: boolean;
  scale: boolean;
  positionLength: number | number[] | null;
}
