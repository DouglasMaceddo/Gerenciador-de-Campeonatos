import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campeonato } from '../../Models/camp.model';
import { CommonModule } from '@angular/common';
import { CampeonatoService } from '../../Services/campeonatoService';
import { Location } from '@angular/common';
import { Confronto } from '../../Models/confronto.model';
import { Time } from '../../Models/time.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-camp',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizar-camp.component.html',
  styleUrls: ['./visualizar-camp.component.css']
})
export class VisualizarCampComponent implements OnInit {
  campeonato?: Campeonato;
  mensagem: string = '';
  classificacao: any[] = [];
  rodadaSelecionada: number | null = null;
  confrontoSelecionado: Confronto | null = null;
  eventoJogadorId: string = '';

  // ===== Modal: Adicionar Jogador =====
  modalJogadorAberto = false;
  timeSelecionado?: Time;
  novoJogadorNome: string = '';
  novoJogadorPosicao: string = '';
  mensagemJogador: string = '';

  constructor(
    private router: Router,
    private campeonatoService: CampeonatoService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.campeonato = this.campeonatoService.getById(id);
      if (this.campeonato) {
        this.classificacao = this.campeonato.classificacao || this.campeonatoService.calcularClassificacao(this.campeonato.id);
        this.rodadaSelecionada = this.detectRodadaAtual();
      }
    }
  }

  voltarHome(): void {
    this.location.back();
  }

  Eliminatorias() {
    if (!this.campeonato) return;
    this.router.navigate(['/Eliminatorias', this.campeonato.id]);
  }

  adicionarTimes(): void {
    if (!this.campeonato) return;
    this.router.navigate(['/Criar_Times', this.campeonato.id]);
  }

  private detectRodadaAtual(): number | null {
    if (!this.campeonato || !this.campeonato.confrontos || this.campeonato.confrontos.length === 0) return null;
    const rondas = Array.from(new Set((this.campeonato.confrontos || []).map(c => c.rodada))).sort((a, b) => a - b);
    for (const r of rondas) {
      const jogosDaRodada = (this.campeonato!.confrontos || []).filter(c => c.rodada === r);
      const algumNaoFinalizado = jogosDaRodada.some(j => !j.finalizado);
      if (algumNaoFinalizado) return r;
    }
    return rondas[rondas.length - 1] || null;
  }

  // ===== Modal: Adicionar Jogador =====

  abrirModalJogador(time: Time): void {
    this.timeSelecionado = time;
    this.novoJogadorNome = '';
    this.novoJogadorPosicao = '';
    this.mensagemJogador = '';
    this.modalJogadorAberto = true;
  }

  fecharModalJogador(): void {
    this.modalJogadorAberto = false;
    this.timeSelecionado = undefined;
  }

  confirmarAdicionarJogador(): void {
    if (!this.campeonato || !this.timeSelecionado) return;

    const nome = this.novoJogadorNome.trim();
    if (!nome) {
      this.mensagemJogador = 'Informe o nome do jogador.';
      return;
    }

    const jogador = {
      id: crypto.randomUUID(),
      nome,
      posicao: this.novoJogadorPosicao.trim() || undefined
    };

    const resultado = this.campeonatoService.addJogador(
      this.campeonato.id,
      this.timeSelecionado.id,
      jogador
    );

    // Recarrega o campeonato atualizado do storage
    this.campeonato = this.campeonatoService.getById(this.campeonato.id);

    if (resultado.includes('sucesso')) {
      this.fecharModalJogador();
    } else {
      this.mensagemJogador = resultado;
    }
  }

  removerJogador(time: Time, jogadorId: string): void {
    if (!this.campeonato) return;
    this.campeonatoService.removeJogador(this.campeonato.id, time.id, jogadorId);
    this.campeonato = this.campeonatoService.getById(this.campeonato.id);
  }
}