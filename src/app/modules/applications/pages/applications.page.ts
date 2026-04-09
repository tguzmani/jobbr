import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationsService } from '../services/applications.service';
import { AppCardComponent } from '../components/app-card/app-card.component';
import { KanbanBoardComponent } from '../components/kanban-board/kanban-board.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { APPLICATION_STATUSES, STATUS_LABELS, ApplicationStatus } from '../models/job-application.model';

export type ViewMode = 'list' | 'kanban';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [RouterLink, FormsModule, AppCardComponent, KanbanBoardComponent, LoadingSpinnerComponent, EmptyStateComponent, IconComponent],
  templateUrl: './applications.page.html',
  styleUrl: './applications.page.scss'
})
export class ApplicationsComponent {
  appService = inject(ApplicationsService);
  statuses = APPLICATION_STATUSES;
  statusLabels = STATUS_LABELS;

  viewMode = signal<ViewMode>((localStorage.getItem('viewMode') as ViewMode) || 'list');

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
    localStorage.setItem('viewMode', mode);
  }
  searchQuery = signal('');
  statusFilter = signal<ApplicationStatus | null>(null);
  sortBy = signal<'updatedAt' | 'appliedAt' | 'company'>('updatedAt');

  filteredApps = computed(() => {
    let apps = this.appService.applications();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();

    if (query) {
      apps = apps.filter(a =>
        a.company.toLowerCase().includes(query) ||
        a.role.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (status) {
      apps = apps.filter(a => a.status === status);
    }

    const sort = this.sortBy();
    return [...apps].sort((a, b) => {
      if (sort === 'company') return a.company.localeCompare(b.company);
      const aDate = a[sort]?.toMillis?.() ?? 0;
      const bDate = b[sort]?.toMillis?.() ?? 0;
      return bDate - aDate;
    });
  });
}
