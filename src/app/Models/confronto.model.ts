import { EventoPartida } from "./eventoPartida.model";
import { Time } from "./time.model";

export interface Confronto {
  id: string;
  timeA: Time;
  timeB: Time;
  rodada: number;
  golsA?: number | null;
  golsB?: number | null;
  penaltisA?:number;
  penaltisB?: number;
  vencedor?: Time;
  finalizado?: boolean;
  eventos: EventoPartida[];
  fase?: 'grupos' | 'quartas' | 'semis' | 'final';
}
