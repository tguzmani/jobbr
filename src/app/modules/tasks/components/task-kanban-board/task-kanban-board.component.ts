import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TasksService } from '../../services/tasks.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  TASK_TYPE_LABELS,
  TASK_TYPE_COLORS,
  TaskStatus,
  Task
} from '../../models/task.model';

@Component({
  selector: 'app-task-kanban-board',
  standalone: true,
  imports: [RouterLink, DragDropModule, DatePipe, IconComponent],
  templateUrl: './task-kanban-board.component.html',
  styleUrl: './task-kanban-board.component.scss'
})
export class TaskKanbanBoardComponent {
  private tasksService = inject(TasksService);

  statuses = TASK_STATUSES;
  STATUS_LABELS = TASK_STATUS_LABELS;
  STATUS_COLORS = TASK_STATUS_COLORS;
  TYPE_LABELS = TASK_TYPE_LABELS;
  TYPE_COLORS = TASK_TYPE_COLORS;

  columns = computed(() => {
    const byStatus = this.tasksService.byStatus();
    return TASK_STATUSES.map(status => ({
      status,
      label: TASK_STATUS_LABELS[status],
      color: TASK_STATUS_COLORS[status],
      tasks: byStatus[status]
    }));
  });

  connectedLists = TASK_STATUSES.map(s => `task-column-${s}`);

  getColumnId(status: TaskStatus): string {
    return `task-column-${status}`;
  }

  isOverdue(task: Task): boolean {
    if (task.status === 'accepted' || task.status === 'failed') return false;
    return task.dueDate.toDate() < new Date();
  }

  async onDrop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus) {
    const task: Task = event.item.data;
    if (task.status === targetStatus) return;
    await this.tasksService.update(task.id, { status: targetStatus });
  }
}
