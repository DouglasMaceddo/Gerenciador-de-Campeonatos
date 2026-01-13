import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.router.navigate(['Perfil']);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
