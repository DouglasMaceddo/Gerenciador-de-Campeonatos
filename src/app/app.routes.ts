import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { PeladeirosComponent } from './Pages/peladeiros/peladeiros.component';
import { CriarCampComponent } from './Pages/criar-camp/criar-camp.component';
import { VisualizarCampComponent } from './Pages/visualizar-camp/visualizar-camp.component';
import { LoginComponent } from './Pages/login/login.component';
import { CadastrarComponent } from './Pages/login/cadastrar/cadastrar.component';
import { AuthGuard } from './Services/auth-guard.service';
import { PerfilComponent } from './Pages/perfil/perfil.component';
import { CriarTimesComponent } from './Pages/criar-times/criar-times.component';
import { EliminatoriasComponent } from './Pages/eliminatorias/eliminatorias.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'Home',
        component: HomeComponent
    },
    {
        path: 'Peladeiros',
        component: PeladeirosComponent
    },
    {
        path: 'Criar_Campeonato',
        component: CriarCampComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'Criar_Times/:id',
        component:CriarTimesComponent,
    },
    {
        path: 'Visualizar_Campeonatos',
        component: VisualizarCampComponent
    },
    {
        path: 'Visualizar_Camp/:id', 
        component: VisualizarCampComponent
    },
    {
        path: 'Login',
        component: LoginComponent
    },
    {
        path: 'Cadastro',
        component: CadastrarComponent
    },
    {
        path: 'Perfil',
        component: PerfilComponent
    },
    {
        path: 'Eliminatorias/:id',
        component: EliminatoriasComponent
    }
];
