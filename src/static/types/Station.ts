export interface Station {
  [index: string]: number | string | [number, number];
  id: number;
  name: string;
  coords: [number, number];
  capacity: number;
  flowMorning: number;
  flowEvening: number;
}