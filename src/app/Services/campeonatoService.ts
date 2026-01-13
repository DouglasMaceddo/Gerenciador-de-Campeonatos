// src/app/Services/campeonato.service.ts
import { Injectable } from '@angular/core';
import { Campeonato } from '../Models/camp.model';
import { Confronto } from '../Models/confronto.model';
import { Time } from '../Models/time.model';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {
  private key = 'campeonatos';

  private getAll(): Campeonato[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  private saveAll(campeonatos: Campeonato[]): void {
    localStorage.setItem(this.key, JSON.stringify(campeonatos));
  }
  private saveOne(campeonato: Campeonato): void {
    const campeonatos = this.getAll();
    const idx = campeonatos.findIndex(c => c.id === campeonato.id);
    if (idx === -1) {
      campeonatos.push(campeonato);
    } else {
      campeonatos[idx] = campeonato;
    }
    this.saveAll(campeonatos);
  }

  public save(campeonato: Campeonato): void {
    this.saveOne(campeonato);
  }

  private atualizarArtilharia(camp: Campeonato): void {
    camp.artilheiros = [];

    const mapa: Record<string, any> = {};

    for (const confronto of [
      ...(camp.confrontos ?? []),
      ...(camp.quartas ?? []),
      ...(camp.semis ?? []),
      ...(camp.final ?? [])
    ]) {
      for (const ev of confronto.eventos ?? []) {
        if (ev.tipo !== 'gol') continue;

        if (!mapa[ev.jogadorId]) {
          const time = camp.times.find(t => t.id === ev.timeId);

          mapa[ev.jogadorId] = {
            id: ev.jogadorId,
            nome: ev.jogadorNome,
            time: time?.nome ?? '',
            gols: 1
          };
        } else {
          mapa[ev.jogadorId].gols++;
        }
      }
    }

    camp.artilheiros = Object.values(mapa).sort(
      (a: any, b: any) => b.gols - a.gols
    );
  }

  getById(id: string): Campeonato | undefined {
    return this.getAll().find(c => c.id === id);
  }

  getByUser(userId: string): Campeonato[] {
    return this.getAll().filter(c => c.userId === userId);
  }

  addTime(campId: string, time: Time): string {
    const campeonatos = this.getAll();
    const camp = campeonatos.find(c => c.id === campId);

    if (!camp) return 'Campeonato não encontrado.';
    camp.times = camp.times || [];

    if (camp.times.length >= camp.numTimes) {
      return `Limite de ${camp.numTimes} times atingido!`;
    }

    const nomeJaExiste = camp.times.some(t => t.nome.toLowerCase() === time.nome.toLowerCase());
    if (nomeJaExiste) {
      return 'Já existe um time com esse nome neste campeonato.';
    }

    camp.times.push(time);
    this.saveAll(campeonatos);
    return 'Time adicionado com sucesso!';
  }

  removeTime(campId: string, timeId: string): string {
    const campeonatos = this.getAll();
    const camp = campeonatos.find(c => c.id === campId);
    if (!camp) return 'Campeonato não encontrado';
    camp.times = (camp.times || []).filter(t => t.id !== timeId);
    this.saveAll(campeonatos);
    return 'Time removido';
  }

  addJogador(campId: string, timeId: string, jogador: any): string {
    const campeonato = this.getById(campId);
    if (!campeonato) return 'Campeonato não encontrado';
    const time = campeonato.times.find(t => t.id === timeId);
    if (!time) return 'Time não encontrado';

    time.jogadores = time.jogadores || [];
    time.jogadores.push(jogador);
    this.saveOne(campeonato);
    return 'Jogador adicionado com sucesso!';
  }

  removeJogador(campId: string, timeId: string, jogadorId: string): string {
    const campeonato = this.getById(campId);
    if (!campeonato) return 'Campeonato não encontrado';
    const time = campeonato.times.find(t => t.id === timeId);
    if (!time) return 'Time não encontrado';

    time.jogadores = (time.jogadores || []).filter(j => j.id !== jogadorId);
    this.saveOne(campeonato);
    return 'Jogador removido';
  }

  gerarFaseDeGrupos(camp: Campeonato): string {
    if (camp.times.length !== camp.numTimes) {
      return 'Ainda não há times suficientes.';
    }

    camp.confrontos = [];
    camp.classificacao = [];
    camp.fase = 'grupos';

    const times = [...camp.times];
    const n = times.length;
    const rounds = n - 1;
    const arr = [...times];

    for (let r = 0; r < rounds; r++) {
      for (let i = 0; i < n / 2; i++) {
        camp.confrontos.push({
          id: crypto.randomUUID(),
          timeA: arr[i],
          timeB: arr[n - 1 - i],
          rodada: r + 1,
          golsA: null,
          golsB: null,
          finalizado: false,
          eventos: []
        });
      }
      const last = arr.pop()!;
      arr.splice(1, 0, last);
    }

    this.saveOne(camp);
    return 'Fase de grupos gerada!';
  }

  public updateConfronto(campId: string, confronto: Confronto): string {
    const campeonato = this.getById(campId);
    if (!campeonato) return 'Campeonato não encontrado';

    campeonato.confrontos ??= [];

    const idx = campeonato.confrontos.findIndex(c => c.id === confronto.id);
    if (idx === -1) return 'Confronto não encontrado';

    const c = campeonato.confrontos[idx];

    c.golsA = confronto.golsA ?? null;
    c.golsB = confronto.golsB ?? null;
    c.eventos = confronto.eventos ?? [];

    // ✅ FINALIZA SE AMBOS OS GOLS EXISTIREM
    if (c.golsA !== null && c.golsB !== null) {
      c.finalizado = true;
    }
    this.atualizarArtilharia(campeonato);
    this.saveOne(campeonato);
    this.calcularClassificacao(campeonato.id);

    return 'Placar atualizado';
  }


  public calcularClassificacao(campId: string): any[] {
    const campeonato = this.getById(campId);
    if (!campeonato) return [];
    const times = campeonato.times || [];
    const tabela: { [timeId: string]: any } = {};
    times.forEach(t => {
      tabela[t.id] = { id: t.id, nome: t.nome, pontos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0, saldo: 0, jogos: 0 };
    });

    (campeonato.confrontos || []).forEach(c => {
      if (c.golsA === null || c.golsA === undefined) return;
      if (c.golsB === null || c.golsB === undefined) return;
      const a = tabela[c.timeA.id];
      const b = tabela[c.timeB.id];
      if (!a || !b) return;
      a.jogos++; b.jogos++;
      a.golsPro += c.golsA; a.golsContra += c.golsB;
      b.golsPro += c.golsB; b.golsContra += c.golsA;
      if (c.golsA > c.golsB) { a.vitorias++; b.derrotas++; a.pontos += 3; }
      else if (c.golsA < c.golsB) { b.vitorias++; a.derrotas++; b.pontos += 3; }
      else { a.empates++; b.empates++; a.pontos++; b.pontos++; }
    });

    Object.values(tabela).forEach((row: any) => row.saldo = row.golsPro - row.golsContra);

    const classificacao = Object.values(tabela).sort((x: any, y: any) => {
      if (y.pontos !== x.pontos) return y.pontos - x.pontos;
      if (y.saldo !== x.saldo) return y.saldo - x.saldo;
      if (y.golsPro !== x.golsPro) return y.golsPro - x.golsPro;
      return x.nome.localeCompare(y.nome);
    });

    campeonato.classificacao = classificacao;
    this.saveOne(campeonato);
    return classificacao;
  }

  private criarConfronto(timeA: Time, timeB: Time, fase: 'quartas' | 'semis' | 'final'
  ): Confronto {
    return {
      id: crypto.randomUUID(),
      timeA,
      timeB,
      rodada: 0,
      golsA: null,
      golsB: null,
      finalizado: false,
      eventos: [],
      fase
    };
  }

  private vencedor(c: Confronto): Time {
    const gA = c.golsA ?? 0;
    const gB = c.golsB ?? 0;
    return gA > gB ? c.timeA : c.timeB;
  }

  gerarQuartas(camp: Campeonato): string {

    if (!camp.classificados || camp.classificados.length < 8) {
      return 'Times insuficientes para quartas.';
    }

    camp.quartas = [
      this.criarConfronto(camp.classificados[0], camp.classificados[7], 'quartas'),
      this.criarConfronto(camp.classificados[3], camp.classificados[4], 'quartas'),
      this.criarConfronto(camp.classificados[1], camp.classificados[6], 'quartas'),
      this.criarConfronto(camp.classificados[2], camp.classificados[5], 'quartas')
    ];

    camp.fase = 'quartas';
    this.saveOne(camp);

    return 'Quartas de final geradas!';
  }

  gerarSemis(camp: Campeonato): string {
    if (!camp.quartas || camp.quartas.length < 4) {
      return "Quartas ainda não foram concluídas.";
    }

    const finalizadas = camp.quartas.filter(q => q.finalizado);
    if (finalizadas.length !== 4) {
      return "Ainda existem jogos das quartas sem resultado.";
    }

    camp.semis = [];

    camp.semis.push(
      this.criarConfronto(this.vencedor(finalizadas[0]), this.vencedor(finalizadas[1]), 'semis'),
      this.criarConfronto(this.vencedor(finalizadas[2]), this.vencedor(finalizadas[3]), 'semis')
    );

    this.saveOne(camp);
    return "Semifinais geradas!";
  }

  gerarFinal(camp: Campeonato): string {
    if (!camp.semis || camp.semis.length < 2) {
      return "Semifinais não disponíveis.";
    }

    const semiFinalizadas = camp.semis.filter(s => s.finalizado);
    if (semiFinalizadas.length !== 2) {
      return "Ainda existem semifinais sem resultado.";
    }

    camp.final = [];

    camp.final.push(
      this.criarConfronto(
        this.vencedor(semiFinalizadas[0]),
        this.vencedor(semiFinalizadas[1]),
        'final'
      )
    );

    this.saveOne(camp);
    return "Final criada!";
  }

  finalizarRodada(campId: string, rodada: number): string {
    const campeonato = this.getById(campId);
    if (!campeonato) return 'Campeonato não encontrado';
    campeonato.confrontos = campeonato.confrontos || [];
    campeonato.confrontos = campeonato.confrontos.map(c => {
      if (c.rodada === rodada) {
        // só permite finalizar se ambos gols estiverem preenchidos
        if (
          c.golsA === null || c.golsA === undefined ||
          c.golsB === null || c.golsB === undefined
        ) {
          return c;
        }

        return { ...c, finalizado: true };
      }
      return c;
    });

    this.saveOne(campeonato);
    // recalcula classificação após finalizar rodada
    this.calcularClassificacao(campeonato.id);
    return `Rodada ${rodada} finalizada (quando todos os jogos tinham placares).`;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
      return (crypto as any).randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
  }

  finalizarFaseDeGrupos(campId: string): string {
    const camp = this.getById(campId);
    if (!camp) return 'Campeonato não encontrado';

    if (!camp.confrontos || camp.confrontos.some(
      c => c.golsA === null || c.golsB === null
    )) {
      return 'Ainda existem jogos pendentes.';
    }

    camp.confrontos.forEach(c => c.finalizado = true);
    this.calcularClassificacao(camp.id);

    camp.classificados = camp.classificacao!
      .map(c => camp.times.find(t => t.id === c.id)!)
      .filter(Boolean);

    const qtd = camp.classificados.length;

    if (qtd >= 8) {
      return this.gerarQuartas(camp);
    }

    if (qtd >= 4) {
      camp.semis = [
        this.criarConfronto(camp.classificados[0], camp.classificados[3], 'semis'),
        this.criarConfronto(camp.classificados[1], camp.classificados[2], 'semis')
      ];
      camp.fase = 'semis';
      this.saveOne(camp);
      return 'Semifinais geradas automaticamente!';
    }

    if (qtd >= 2) {
      camp.final = [
        this.criarConfronto(camp.classificados[0], camp.classificados[1], 'final')
      ];
      camp.fase = 'final';
      this.saveOne(camp);
      return 'Final gerada automaticamente!';
    }

    return 'Times insuficientes para fase eliminatória.';
  }

  updatePlacarEliminatoria(
    campId: string,
    fase: 'quartas' | 'semis' | 'final',
    confrontoId: string,
    golsA: number,
    golsB: number,
    eventos: any[] = []
  ): string {

    const camp = this.getById(campId);
    if (!camp) return "Campeonato não encontrado.";

    const lista = camp[fase] || [];
    const confronto = lista.find(c => c.id === confrontoId);

    if (!confronto) return "Confronto não encontrado.";

    confronto.golsA = golsA;
    confronto.golsB = golsB;
    confronto.eventos = eventos;

    if (golsA != null && golsB != null) {
      confronto.finalizado = true;
    }

    this.atualizarArtilharia(camp);
    this.saveOne(camp);

    return "Placar atualizado!";
  }
}