import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export class AuthComponent {
  private authService = inject(AuthService);
  loading = false;
  dots = Array.from({ length: 20 }, (_, i) => i);

  async signIn() {
    this.loading = true;
    try {
      await this.authService.signInWithGoogle();
    } catch {
      this.loading = false;
    }
  }
}
