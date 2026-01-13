export interface EventoPartida {
  jogadorId: string;
  jogadorNome: string;
  timeId: string;
  tipo: 'gol' | 'amarelo' | 'vermelho';
}