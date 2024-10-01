export interface Spawn {
  name: string;
  ubication: [number, number, number];
}

export interface Items {
  name: string;
  id: number;
  position: { x: number; y: number; z: number };
}

export interface Settings {
  title: string;
  env: string;
  description: string;
  teleports: any[];
  spawns: Spawn[];
  items: Items[];
}
