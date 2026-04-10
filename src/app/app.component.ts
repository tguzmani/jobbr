import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './modules/auth/services/auth.service';
import { NavSidebarComponent } from './shared/components/nav-sidebar/nav-sidebar.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { KeyboardShortcutService } from './shared/services/keyboard-shortcut.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavSidebarComponent, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  private keyboardShortcuts = inject(KeyboardShortcutService);

  ngOnInit(): void {
    this.keyboardShortcuts.init();
  }
}
