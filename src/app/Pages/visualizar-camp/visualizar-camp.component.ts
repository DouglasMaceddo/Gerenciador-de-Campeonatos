import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campeonato } from '../../Models/camp.model';
import { CommonModule } from '@angular/common';
import { CampeonatoService } from '../../Services/campeonatoService';
import { Location } from '@angular/common';
import { Confronto } from '../../Models/confronto.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizar-camp',
  imports: [CommonModule, FormsModule],
  templateUrl:'./visualizar-camp.component.html',
  styleUrls: ['./visualizar-camp.component.css']
})
export class VisualizarCampComponent implements OnInit {
  campeonato?: Campeonato;
  mensagem: string = '';
  classificacao: any[] = [];
  rodadaSelecionada: number | null = null;
  modalAberto = false;
  confrontoSelecionado: Confronto | null = null;
  eventoJogadorId: string = '';

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
}
