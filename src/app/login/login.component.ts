import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <h2>Halt!</h2>
      <p>
        Enter the name of a course that teaches a modern declarative approach to
        Angular:
      </p>
      <form (ngSubmit)="handleLogin($event)">
        <input type="text" [(ngModel)]="password" />
        <button type="submit">Login</button>
      </form>
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
  password = signal('');

  handleLogin() {
    console.log(this.password());
  }
}
