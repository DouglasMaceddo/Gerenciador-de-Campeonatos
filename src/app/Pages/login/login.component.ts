import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string ='';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const success = this.authService.login(this.email, this.password);
  
    if (success) {
      this.message = 'Login realizado com sucesso!';
      this.router.navigate(['Perfil']); 
    } else {
      this.message = 'E-mail ou senha incorretos!';
      setTimeout(() => {
        this.message = '';
      }, 1000);
    }
  }  

  cadastro(){
    this.router.navigate(['Cadastro'])
  }

  voltarHome(route : String){
    this.router.navigate([route])
  }
}
