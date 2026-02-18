export type FlightStatus = 'programado' | 'embarcando' | 'en vuelo' | 'aterrizado' | 'cancelado';
export type PlaneStatus = 'disponible' | 'en vuelo' | 'en mantenimiento';
export type UserRole = 'admin' | 'operador';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface CrewMember {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  licencia: string;
  disponible: boolean;
}

export interface Plane {
  id: string;
  modelo: string;
  matricula: string;
  capacidad: number;
  estado: PlaneStatus;
  fabricante: string;
}

export interface Flight {
  id: string;
  numeroVuelo: string;
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  fechaLlegada: string;
  horaLlegada: string;
  estado: FlightStatus;
  avionId: string | null;
  tripulacionIds: string[];
  deleted: boolean;
}

export interface AppContextType {
  user: User | null;
  flights: Flight[];
  planes: Plane[];
  crew: CrewMember[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Flights
  addFlight: (flight: Omit<Flight, 'id' | 'deleted'>) => void;
  updateFlight: (id: string, flight: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  // Planes
  addPlane: (plane: Omit<Plane, 'id'>) => void;
  updatePlane: (id: string, plane: Partial<Plane>) => void;
  // Crew
  addCrewMember: (member: Omit<CrewMember, 'id'>) => void;
  updateCrewMember: (id: string, member: Partial<CrewMember>) => void;
}