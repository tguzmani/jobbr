import { Component, input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Task, TaskStatus, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { ApplicationsService } from '../../../applications/services/applications.service';
import { TaskStatusBadgeComponent } from '../task-status-badge/task-status-badge.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink, DatePipe, TaskStatusBadgeComponent, IconComponent],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  private tasksService = inject(TasksService);
  private appsService = inject(ApplicationsService);
  task = input.required<Task>();

  typeLabel = computed(() => TASK_TYPE_LABELS[this.task().type]);
  typeColor = computed(() => TASK_TYPE_COLORS[this.task().type]);

  companyName = computed(() => {
    const appId = this.task().applicationId;
    if (!appId) return null;
    return this.appsService.getCompanyName(appId);
  });

  isOverdue = computed(() => {
    const task = this.task();
    if (task.status === 'accepted' || task.status === 'failed') return false;
    return task.dueDate.toDate() < new Date();
  });

  isDueSoon = computed(() => {
    const task = this.task();
    if (task.status === 'accepted' || task.status === 'failed') return false;
    const due = task.dueDate.toDate();
    const now = new Date();
    const in2Days = new Date();
    in2Days.setDate(now.getDate() + 2);
    return due > now && due <= in2Days;
  });

  async onStatusChange(status: TaskStatus) {
    await this.tasksService.update(this.task().id, { status });
  }
}
