import { Time } from "./time.model";
import { Confronto } from "./confronto.model";
import { Artilheiro } from "./artilheiro.model";
import { FaseCampeonato } from "./faseCamp.model";

export interface Campeonato {
  id: string;
  nome: string;
  descricao: string;
  formato: string;
  numTimes: number;
  userId: string;
  times: Time[];
  confrontos?: Confronto[];
  classificados?: Time[];
  quartas?: Confronto[];
  semis?: Confronto[];
  final?: Confronto[];
  classificacao?: any[];
  artilheiros?: Artilheiro [];
  fase?: FaseCampeonato;
}