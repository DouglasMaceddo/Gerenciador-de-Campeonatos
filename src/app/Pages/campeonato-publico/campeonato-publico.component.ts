import { CommonModule, ɵnormalizeQueryParams } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Campeonato } from '../../Models/camp.model';
import { CampeonatoService } from '../../Services/campeonatoService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-campeonato-publico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campeonato-publico.component.html',
  styleUrls: ['./campeonato-publico.component.css']
})
export class CampeonatoPublicoComponent {
  campeonatos: Campeonato[] = [];

  constructor(
    private campeonatoService: CampeonatoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarCampeonatos();
  }

  carregarCampeonatos(): void {
    const data = localStorage.getItem('campeonatos');
    this.campeonatos = data ? JSON.parse(data) : [];
  }

  visualizar(id: string): void {
  this.router.navigate(['/Eliminatorias', id], {
    queryParams: { publico: true }
  });
}

  voltar(): void {
    this.router.navigate(['Home']);
  }
}
