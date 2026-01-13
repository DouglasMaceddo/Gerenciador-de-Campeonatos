import { Jogador } from "./jogador.model";

export interface Time {
    id: string;
    nome: string;
    logoUrl?: string;
    jogadores: Jogador[];
  }  