import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-peladeiros',
  imports: [CommonModule, FormsModule],
  templateUrl: './peladeiros.component.html',
  styleUrl: './peladeiros.component.css'
})
export class PeladeirosComponent {
  novoJogador: string = '';
  jogadores: string[] = [];
  jogadoresportime: number = 2;
  times: string[][] = [];
  options: number [] = [1,2,3,4,5,6,7,8,9,10];

  constructor(private router: Router) { }

  addPlayers(): void {
    if (this.novoJogador.trim() !== '') {
      const players = this.novoJogador.split(',').map(player => player.trim()).filter(player => player !== '');
      this.jogadores.push(...players);
      this.novoJogador = '';
    }
  }

  drawTeams(): void {
    this.times = [];

    if (this.jogadores.length < this.jogadoresportime) {
      alert('Não há jogadores suficientes para formar um time!');
      return;
    }
    this.shuffle(this.jogadores);
  
    const quantidadeTimes = Math.ceil(this.jogadores.length / this.jogadoresportime);
    let playersCopy = [...this.jogadores];

    for (let i = 0; i < quantidadeTimes; i++) {
      const team: string[] = playersCopy.splice(0, this.jogadoresportime);
      this.times.push(team);
    }
  }

  shuffle(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  voltarHome(router: string){
      this.router.navigate([router]);
  }
}