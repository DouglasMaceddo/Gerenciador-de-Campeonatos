import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Campeonato } from '../../Models/camp.model';
import { Confronto } from '../../Models/confronto.model';
import { EventoPartida } from '../../Models/eventoPartida.model';
import { CampeonatoService } from '../../Services/campeonatoService';

@Component({
  selector: 'app-eliminatorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eliminatorias.component.html',
  styleUrl: './eliminatorias.component.css'
})
export class EliminatoriasComponent implements OnInit {
  camp!: Campeonato;
  mensagem = '';
  classificacao: any[] = [];
  artilheiros: any[] = [];
  quartas: Confronto[] = [];
  semis: Confronto[] = [];
  final: Confronto[] = [];
  rodadaSelecionada: number | null = null;
  modalAberto = false;
  confrontoSelecionado: Confronto | null = null;
  eventoJogadorId = '';
  eventoTipo: 'gol' | 'amarelo' | 'vermelho' = 'gol';

  constructor(
    private route: ActivatedRoute,
    private campeonatoService: CampeonatoService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const camp = this.campeonatoService.getById(id);
    if (!camp) return;

    this.camp = camp;
    this.camp.fase ??= 'grupos';

    this.reload();
    this.atualizarDados();
    this.rodadaSelecionada = this.detectRodadaAtual();

  }

  reload(): void {
    const atualizado = this.campeonatoService.getById(this.camp.id)!;
    this.camp = atualizado;

    this.quartas = atualizado.quartas ?? [];
    this.semis = atualizado.semis ?? [];
    this.final = atualizado.final ?? [];
  }

  atualizarDados(): void {
    this.artilheiros = this.camp.artilheiros ?? [];
    this.classificacao = this.campeonatoService.calcularClassificacao(this.camp.id);

  }

  onPlacarChange(confronto: Confronto): void {
    if (!this.camp) return;

    confronto.golsA = confronto.golsA != null ? Number(confronto.golsA) : null;
    confronto.golsB = confronto.golsB != null ? Number(confronto.golsB) : null;

    this.mensagem = this.campeonatoService.updateConfronto(this.camp.id, confronto);
    this.reload();
    this.atualizarDados();
  }

  gerarFaseDeGrupos(): void {
    this.mensagem = this.campeonatoService.gerarFaseDeGrupos(this.camp);
    this.reload();
    this.atualizarDados();
  }

  finalizarFaseDeGrupos(): void {
    this.mensagem = this.campeonatoService.finalizarFaseDeGrupos(this.camp.id);
    this.reload();
    this.atualizarDados();
  }

  atualizarPlacar(
    confronto: Confronto | null,
    fase: 'quartas' | 'semis' | 'final'
  ): void {

    const lista = this.camp[fase] as Confronto[];

    for (const c of lista) {
      if (c.golsA == null || c.golsB == null) {
        this.mensagem = 'Ainda existem jogos sem placar.';
        return;
      }

      // ⚠️ empate → exige pênaltis
      if (c.golsA === c.golsB) {
        if (c.penaltisA == null || c.penaltisB == null) {
          this.mensagem = 'Preencha o placar das penalidades.';
          return;
        }

        if (c.penaltisA === c.penaltisB) {
          this.mensagem = 'Pênaltis não podem terminar empatados.';
          return;
        }
      }

      c.finalizado = true;
    }

    if (fase === 'quartas') {
      this.mensagem = this.campeonatoService.gerarSemis(this.camp);
      this.camp.fase = 'semis';
    }

    if (fase === 'semis') {
      this.mensagem = this.campeonatoService.gerarFinal(this.camp);
      this.camp.fase = 'final';
    }

    if (fase === 'final') {
      this.camp.fase = 'encerrado';
      this.mensagem = 'Campeonato encerrado!';
    }

    this.campeonatoService.save(this.camp);
    this.reload();
    this.atualizarDados();
  }


  atualizarPlacarPelosEventos(confronto: Confronto): void {
    confronto.eventos = confronto.eventos || [];

    confronto.golsA = confronto.eventos.filter(
      e => e.tipo === 'gol' && e.timeId === confronto.timeA.id
    ).length;

    confronto.golsB = confronto.eventos.filter(
      e => e.tipo === 'gol' && e.timeId === confronto.timeB.id
    ).length;

    if (confronto.fase && confronto.fase !== 'grupos') {
      this.campeonatoService.updatePlacarEliminatoria(
        this.camp.id,
        confronto.fase === 'final' ? 'final' : confronto.fase,
        confronto.id,
        confronto.golsA,
        confronto.golsB,
        confronto.eventos
      );
    } else {
      this.campeonatoService.updateConfronto(this.camp.id, confronto);
    }
    this.atualizarDados();
  }

  abrirEventos(confronto: Confronto): void {
    this.confrontoSelecionado = confronto;
    this.eventoJogadorId = '';
    this.eventoTipo = 'gol';
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.confrontoSelecionado = null;
    this.modalAberto = false;
    this.eventoJogadorId = '';
  }

  registrarEvento(): void {
    if (!this.camp || !this.confrontoSelecionado) return;

    const jogador = this.camp.times
      ?.flatMap(t => t.jogadores || [])
      .find(j => j.id === this.eventoJogadorId);

    if (!jogador) {
      this.mensagem = 'Jogador não encontrado.';
      return;
    }

    const time = this.getTimeDoJogador(jogador.id);

    const evento: EventoPartida = {
      jogadorId: jogador.id,
      jogadorNome: jogador.nome,
      timeId: time?.id ?? '',
      tipo: this.eventoTipo
    };

    switch (this.eventoTipo) {
      case 'gol':
        jogador.gols = (jogador.gols || 0) + 1;
        break;

      case 'amarelo':
        jogador.amarelos = (jogador.amarelos || 0) + 1;
        break;

      case 'vermelho':
        jogador.vermelhos = (jogador.vermelhos || 0) + 1;
        break;
    }

    this.confrontoSelecionado.eventos ??= [];
    this.confrontoSelecionado.eventos.push(evento);
    this.atualizarPlacarPelosEventos(this.confrontoSelecionado);
    this.reload();
    this.atualizarDados();

    this.mensagem = 'Evento registrado com sucesso!';
    this.fecharModal();
  }


  getTimeDoJogador(jogadorId: string) {
    return this.camp.times?.find(t =>
      t.jogadores?.some(j => j.id === jogadorId)
    );
  }

  private detectRodadaAtual(): number | null {
    if (!this.camp.confrontos?.length) return null;

    const rodadas = [...new Set(this.camp.confrontos.map(c => c.rodada))].sort(
      (a, b) => a - b
    );

    for (const r of rodadas) {
      const jogos = this.camp.confrontos.filter(c => c.rodada === r);
      if (jogos.some(j => !j.finalizado)) return r;
    }

    return rodadas.at(-1) ?? null;
  }

  finalizarRodada(): void {
    if (this.rodadaSelecionada == null) return;

    this.mensagem = this.campeonatoService.finalizarRodada(
      this.camp.id,
      this.rodadaSelecionada
    );

    this.reload();
    this.atualizarDados();
    this.rodadaSelecionada = this.detectRodadaAtual();
  }

  voltar(): void {
    this.location.back();
  }
}
