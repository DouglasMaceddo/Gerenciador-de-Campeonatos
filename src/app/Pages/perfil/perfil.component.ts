import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { CampeonatoService } from '../../Services/campeonatoService';
import { CommonModule } from '@angular/common';
import { Campeonato } from '../../Models/camp.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  campeonatos: Campeonato[] = [];
  userId: string = '';

  constructor(private authService: AuthService, private campeonatoService: CampeonatoService, private router: Router) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.uid) {
      this.userId = user.uid;
      this.campeonatos = this.campeonatoService.getByUser(this.userId);
    } else {
      console.error('Usuário não encontrado!');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  navegarCriarCamp(): void {
    this.router.navigate(['/Criar_Campeonato']);
  }

  visualizarDetalhes(id: string): void {
    this.router.navigate(['/Visualizar_Camp', id]);

  }
}