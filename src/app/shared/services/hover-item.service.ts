import { Injectable, signal } from '@angular/core';
import { StatusBadgeComponent } from '../../modules/applications/components/status-badge/status-badge.component';

@Injectable({ providedIn: 'root' })
export class HoverItemService {
  activeBadge = signal<StatusBadgeComponent | null>(null);

  register(badge: StatusBadgeComponent): void {
    this.activeBadge.set(badge);
  }

  unregister(badge: StatusBadgeComponent): void {
    if (this.activeBadge() === badge) {
      this.activeBadge.set(null);
    }
  }

  openStatusMenu(): boolean {
    const badge = this.activeBadge();
    if (badge) {
      badge.openDropdown();
      return true;
    }
    return false;
  }
}
