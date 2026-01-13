import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Campeonato } from '../../Models/camp.model';

@Component({
  selector: 'app-criar-camp',
  imports: [CommonModule, FormsModule],
  templateUrl: './criar-camp.component.html',
  styleUrls: ['./criar-camp.component.css']
})
export class CriarCampComponent implements OnInit {
  nomeCampeonato: string = '';
  descricao: string = '';
  formato: string = 'eliminatorio';
  numTimes = 2;
  campeonatoCriado: Campeonato | null = null;
  userId: any;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  criarCampeonato(): void {
    if (this.nomeCampeonato.trim() && this.numTimes >= 2) {
      const id = this.generateId();
      const campeonato: Campeonato = {
        id,
        nome: this.nomeCampeonato,
        descricao: this.descricao,
        formato: this.formato,
        numTimes: this.numTimes,
        times: [],
        userId: this.authService.getUser()?.uid || 'anon'
      };

      const campeonatos = JSON.parse(localStorage.getItem('campeonatos') || '[]');
      campeonatos.push(campeonato);
      localStorage.setItem('campeonatos', JSON.stringify(campeonatos));

      this.campeonatoCriado = campeonato;

      // limpa form
      this.nomeCampeonato = '';
      this.descricao = '';
      this.numTimes = 2;

    } else {
      alert('Preencha todos os campos corretamente!');
    }
  }

  voltarHome(route: string) {
    this.router.navigate([route]);
  }
  
  private generateId(): string {
    try {
      return (crypto as any).randomUUID();
    } catch {
      return Math.random().toString(36).substring(2, 15);
    }
  }
}