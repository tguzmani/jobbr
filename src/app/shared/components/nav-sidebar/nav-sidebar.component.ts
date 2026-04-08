import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../modules/auth/services/auth.service';

@Component({
  selector: 'app-nav-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-sidebar.component.html',
  styleUrl: './nav-sidebar.component.scss'
})
export class NavSidebarComponent {
  authService = inject(AuthService);
  collapsed = signal(false);
}
