import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomePageComponent },
    { path: '**', redirectTo: '' }
];
