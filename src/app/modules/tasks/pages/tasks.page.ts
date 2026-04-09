import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../services/tasks.service';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { TaskKanbanBoardComponent } from '../components/task-kanban-board/task-kanban-board.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TASK_STATUSES, TASK_STATUS_LABELS, TASK_TYPES, TASK_TYPE_LABELS, TaskStatus, TaskType } from '../models/task.model';

export type ViewMode = 'list' | 'kanban';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [RouterLink, FormsModule, TaskCardComponent, TaskKanbanBoardComponent, LoadingSpinnerComponent, EmptyStateComponent, IconComponent],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss'
})
export class TasksComponent {
  tasksService = inject(TasksService);
  statuses = TASK_STATUSES;
  statusLabels = TASK_STATUS_LABELS;
  types = TASK_TYPES;
  typeLabels = TASK_TYPE_LABELS;

  viewMode = signal<ViewMode>((localStorage.getItem('tasksViewMode') as ViewMode) || 'list');

  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
    localStorage.setItem('tasksViewMode', mode);
  }

  searchQuery = signal('');
  statusFilter = signal<TaskStatus | null>(null);
  typeFilter = signal<TaskType | null>(null);
  sortBy = signal<'updatedAt' | 'dueDate' | 'name'>('dueDate');

  filteredTasks = computed(() => {
    let tasks = this.tasksService.tasks();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const type = this.typeFilter();

    if (query) {
      tasks = tasks.filter(t =>
        t.name.toLowerCase().includes(query) ||
        (t.description?.toLowerCase().includes(query))
      );
    }

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    if (type) {
      tasks = tasks.filter(t => t.type === type);
    }

    const sort = this.sortBy();
    return [...tasks].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'dueDate') return a.dueDate.toMillis() - b.dueDate.toMillis();
      const aDate = a[sort]?.toMillis?.() ?? 0;
      const bDate = b[sort]?.toMillis?.() ?? 0;
      return bDate - aDate;
    });
  });
}
