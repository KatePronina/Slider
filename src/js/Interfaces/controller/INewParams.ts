export default interface INewParams {
  [key: string]: number | number[] | boolean | string | undefined;
  eventType?: 'positionPercentUpdated' | 'stateUpdated';
}
