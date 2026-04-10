import { Injectable, signal } from '@angular/core';

export type ViewMode = 'list' | 'kanban';

@Injectable({ providedIn: 'root' })
export class ViewModeService {
  private modes = new Map<string, ReturnType<typeof signal<ViewMode>>>();

  /** Get or create a reactive view mode signal for a given storage key. */
  getMode(storageKey: string): ReturnType<typeof signal<ViewMode>> {
    if (!this.modes.has(storageKey)) {
      const stored = localStorage.getItem(storageKey) as ViewMode;
      this.modes.set(storageKey, signal<ViewMode>(stored || 'list'));
    }
    return this.modes.get(storageKey)!;
  }

  setMode(storageKey: string, mode: ViewMode): void {
    this.getMode(storageKey).set(mode);
    localStorage.setItem(storageKey, mode);
  }

  toggle(storageKey: string): void {
    const current = this.getMode(storageKey)();
    this.setMode(storageKey, current === 'list' ? 'kanban' : 'list');
  }
}
