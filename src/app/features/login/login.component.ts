import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        (submit)="onSubmit($event)"
        class="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 class="text-xl font-semibold text-gray-800">Store Login</h1>
        <input
          [(ngModel)]="email"
          name="email"
          type="email"
          placeholder="Email"
          class="w-full border rounded-lg px-3 py-3 text-base"
          required
        />
        <input
          [(ngModel)]="password"
          name="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded-lg px-3 py-3 text-base"
          required
        />
        @if (error()) {
          <p class="text-red-600 text-sm">{{ error() }}</p>
        }
        <button
          type="submit"
          [disabled]="loading()"
          class="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
        >
          {{ loading() ? 'Logging in…' : 'Log In' }}
        </button>
      </form>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  constructor(private auth: AuthService) {}

  async onSubmit(e: Event) {
    e.preventDefault();
    this.error.set('');
    this.loading.set(true);
    try {
      await this.auth.login(this.email, this.password);
    } catch {
      this.error.set('Invalid email or password.');
    } finally {
      this.loading.set(false);
    }
  }
}
