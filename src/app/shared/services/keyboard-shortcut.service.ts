import { Injectable, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HoverItemService } from './hover-item.service';
import { ViewModeService } from './view-mode.service';

interface Shortcut {
  key: string;
  route: string;
  /** If set, shortcut only works when the current URL starts with this path */
  context?: string;
}

const SHORTCUTS: Shortcut[] = [
  { key: 'd', route: '/dashboard' },
  { key: 'a', route: '/applications' },
  { key: 't', route: '/tasks' },
  { key: 'p', route: '/profile' },
  { key: 'c', route: '/applications/new', context: '/applications' },
  { key: 'c', route: '/tasks/new', context: '/tasks' },
];

const VIEW_MODE_KEYS: Record<string, { context: string; storageKey: string }[]> = {
  '/applications': [{ context: '/applications', storageKey: 'viewMode' }],
  '/tasks': [{ context: '/tasks', storageKey: 'tasksViewMode' }],
};

@Injectable({ providedIn: 'root' })
export class KeyboardShortcutService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private hoverService = inject(HoverItemService);
  private viewModeService = inject(ViewModeService);

  init(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => !this.isTyping(event) && !event.ctrlKey && !event.metaKey && !event.altKey),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        const key = event.key.toLowerCase();

        // Hover shortcut: press 's' to open status menu on hovered card
        if (key === 's') {
          if (this.hoverService.openStatusMenu()) {
            event.preventDefault();
            return;
          }
        }

        // View mode toggle: 'k' for kanban, 'l' for list
        if (key === 'k' || key === 'l') {
          const mode = key === 'k' ? 'kanban' : 'list';
          for (const [prefix, entries] of Object.entries(VIEW_MODE_KEYS)) {
            for (const entry of entries) {
              if (this.router.url.startsWith(prefix)) {
                this.viewModeService.setMode(entry.storageKey, mode);
                event.preventDefault();
                return;
              }
            }
          }
        }

        const shortcut = SHORTCUTS.find(
          s => s.key === key && (!s.context || this.router.url.startsWith(s.context))
        );
        if (!shortcut) return;

        event.preventDefault();
        this.router.navigateByUrl(shortcut.route);
      });
  }

  private isTyping(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
  }
}
