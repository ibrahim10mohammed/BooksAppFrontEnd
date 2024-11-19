import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { BookListComponent } from '../book-list/book-list.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'books', component: BookListComponent, canActivate: [authGuard] },
    { path: '**', component: NotFoundComponent }, // Handles invalid URLs
];
