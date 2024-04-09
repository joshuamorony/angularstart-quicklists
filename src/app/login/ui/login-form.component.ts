import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="login.emit(password())">
      <input
        type="text"
        [(ngModel)]="password"
        name="password"
        placeholder="rhymes with smangular smart..."
      />
      <button type="submit">Login</button>
    </form>
  `,
  styles: `
    form {
      display: flex;
    }

    input {
      flex: 2;
      margin-right: 1em;
    }

    button {
      flex: 1;
    }
  `,
})
export class LoginFormComponent {
  login = output<string>();
  password = signal('');
}
