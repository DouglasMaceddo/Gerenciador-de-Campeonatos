import { Jogador } from "./jogador.model";

export interface Time {
    id: string;
    nome: string;
    imagem?: string;
    jogadores: Jogador[];
  }  