import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Time } from '../../Models/time.model';
import { Jogador } from '../../Models/jogador.model';
import { Campeonato } from '../../Models/camp.model';
import { CampeonatoService } from '../../Services/campeonatoService';
import { Location } from '@angular/common';

@Component({
  selector: 'app-criar-times',
  imports: [CommonModule, FormsModule],
  templateUrl: './criar-times.component.html',
  styleUrls: ['./criar-times.component.css']
})
export class CriarTimesComponent implements OnInit {
  nomeTime: string = '';
  time: Time = {
    id: '',
    nome: '',
    imagem: '',
    jogadores: []
  };
  imagem: string | null = null;
  jogadores: Jogador[] = [];
  nomeJogador: string = '';
  posicaoJogador: string = '';
  numeroJogador: number | null = null;
  campeonatoId: string = '';
  campeonato?: Campeonato;
  mensagem: string = '';
  campIdNotFound: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private campeonatoService: CampeonatoService,
    private location: Location) { }

  ngOnInit(): void {
    this.campeonatoId = this.route.snapshot.paramMap.get('id') || '';
    console.log('CriarTimesComponent ngOnInit - campeonatoId =', this.campeonatoId);
    if (this.campeonatoId) {
      this.campeonato = this.campeonatoService.getById(this.campeonatoId);
      console.log('campeonato carregado:', this.campeonato);
    } else {
      this.campIdNotFound = true;
    }
  }


  adicionarJogador(): void {
    if (!this.nomeJogador.trim()) { alert('Digite o nome do jogador'); return; }
    const novo: Jogador = {
      id: this.generateId(),
      nome: this.nomeJogador.trim(),
      posicao: this.posicaoJogador || undefined,
      numero: this.numeroJogador || undefined
    };
    this.jogadores.push(novo);
    this.nomeJogador = '';
    this.posicaoJogador = '';
    this.numeroJogador = null;
  }

  removerJogadorTemp(id: string) {
    this.jogadores = this.jogadores.filter(j => j.id !== id);
  }

  adicionarTime(): void {
    if (!this.nomeTime.trim() || this.jogadores.length === 0) {
      alert('Preencha nome do time e adicione pelo menos 1 jogador.');
      return;
    }
    const time: Time = {
      id: this.generateId(),
      nome: this.nomeTime.trim(),
      imagem: this.imagem || undefined,
      jogadores: this.jogadores
    };

    const resp = this.campeonatoService.addTime(this.campeonatoId, time);
    this.mensagem = resp;
    if (resp.includes('sucesso')) {
      // atualiza campeonato local
      this.campeonato = this.campeonatoService.getById(this.campeonatoId);
      // limpa form
      this.nomeTime = '';
      this.imagem = '';
      this.jogadores = [];
    }
  }

  voltarHome(): void {
    this.location.back();
  }

onImagemSelecionada(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  // valida se é imagem
  if (!file.type.startsWith('image/')) {
    this.mensagem = 'Selecione uma imagem válida.';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
     this.imagem = reader.result as string;
  };

  reader.readAsDataURL(file);
}

  private generateId(): string {
    try {
      return (crypto as any).randomUUID();
    } catch {
      return Math.random().toString(36).substring(2, 15);
    }
  }
}
