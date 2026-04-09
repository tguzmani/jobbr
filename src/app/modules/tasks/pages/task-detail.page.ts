import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { TasksService } from '../services/tasks.service';
import { ApplicationsService } from '../../applications/services/applications.service';
import { TaskStatusBadgeComponent } from '../components/task-status-badge/task-status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../../applications/components/confirm-dialog/confirm-dialog.component';
import { TaskCommentListComponent } from '../../task-comments/components/task-comment-list/task-comment-list.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import {
  Task,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  TASK_TYPE_LABELS,
  TASK_TYPE_COLORS,
  TaskStatus
} from '../models/task.model';
import { JobApplication } from '../../applications/models/job-application.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, TaskStatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent, TaskCommentListComponent, IconComponent],
  templateUrl: './task-detail.page.html',
  styleUrl: './task-detail.page.scss'
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private tasksService = inject(TasksService);
  private appsService = inject(ApplicationsService);

  task = signal<Task | null>(null);
  linkedApp = signal<JobApplication | null>(null);
  loading = signal(true);
  showConfirm = signal(false);

  STATUS_LABELS = TASK_STATUS_LABELS;
  STATUS_COLORS = TASK_STATUS_COLORS;
  TYPE_LABELS = TASK_TYPE_LABELS;
  TYPE_COLORS = TASK_TYPE_COLORS;

  isOverdue = computed(() => {
    const t = this.task();
    if (!t || t.status === 'accepted' || t.status === 'failed') return false;
    return t.dueDate.toDate() < new Date();
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const task = await this.tasksService.getById(id);
    this.task.set(task);

    if (task?.applicationId) {
      const app = await this.appsService.getById(task.applicationId);
      this.linkedApp.set(app);
    }

    this.loading.set(false);
  }

  goBack() {
    this.location.back();
  }

  async updateStatus(status: TaskStatus) {
    const t = this.task();
    if (!t) return;
    await this.tasksService.update(t.id, { status });
    this.task.set({ ...t, status });
  }

  async deleteTask(id: string) {
    await this.tasksService.remove(id);
    this.router.navigate(['/tasks']);
  }
}
