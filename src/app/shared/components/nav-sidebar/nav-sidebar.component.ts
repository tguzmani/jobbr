import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { IconComponent } from '../icon/icon.component';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-nav-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './nav-sidebar.component.html',
  styleUrl: './nav-sidebar.component.scss'
})
export class NavSidebarComponent {
  authService = inject(AuthService);
  private sidebarService = inject(SidebarService);
  collapsed = this.sidebarService.collapsed;
}
