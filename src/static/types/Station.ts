export interface Station {
  id: number;
  name: string;
  coords: [number, number];
  capacity: number;
  flowMorning: number;
  flowEvening: number;
}