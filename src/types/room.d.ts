export interface Room {
  namespace: string;
  name: string;
  count: number;
  max: number;
}

export interface Server {
  rooms: Map<string, Room>;
}
