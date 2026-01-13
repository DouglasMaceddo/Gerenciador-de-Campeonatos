import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  cadastrar(email: string, password: string): boolean {
    const existingUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const userExists = existingUsers.some((user: any) => user.email === email);
    if (userExists) {
      return false;
    }

    const newUser = { email, password, uid: this.generateUID() };
    existingUsers.push(newUser);
    localStorage.setItem('usuarios', JSON.stringify(existingUsers));
    return true;
  }

  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = users.find((user: any) => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/Home']);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('loggedInUser') || 'null');
  }

  private generateUID(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
