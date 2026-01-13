import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastrar',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.css'
})
export class CadastrarComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string ='';
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    if (this.password !== this.confirmPassword) {
      this.message = 'As senhas não coincidem!';
      return;
    }
  
    const success = this.authService.cadastrar(this.email, this.password);
    if (success) {
      this.message = 'Cadastro realizado com sucesso!';
      this.clearForm();
    } else {
      this.message = 'Usuário já existe!';
    }
  }

  clearForm() {
    this.email = '';
    this.password = '';
    this.confirmPassword ='';
  }

  Login(){
    this.router.navigate(['Login'])
  }
}