export interface Street {
  [index: string]: number | string | [number, number];
  id: number;
  name: string;
  coords: [number, number];
  transport_in_hour: number;
  rush_hour: number;
  max_load: number;
}