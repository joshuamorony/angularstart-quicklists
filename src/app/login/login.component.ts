import { Component, inject, effect } from '@angular/core';
import { LoginFormComponent } from './ui/login-form.component';
import { AuthService } from '../shared/data-access/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  template: `
    <div class="login-container">
      <h2>Hey!</h2>
      <p>
        Enter the name of a course that teaches a modern declarative approach to
        Angular:
      </p>
      <app-login-form (login)="authService.login$.next($event)" />
      @if (authService.status() === 'fail') {
        <p>Nope... try again</p>
      }
      <h2></h2>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center
    }

    .login-container {
      width: 70%;
      background: #fff;
      padding: 2em;
    }
  `,
})
export default class LoginComponent {
  authService = inject(AuthService);
}
