import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location, DatePipe, DecimalPipe } from '@angular/common';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApplicationsService } from '../services/applications.service';
import { TasksService } from '../../tasks/services/tasks.service';
import { StatusBadgeComponent } from '../components/status-badge/status-badge.component';
import { TaskStatusBadgeComponent } from '../../tasks/components/task-status-badge/task-status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { CommentListComponent } from '../../comments/components/comment-list/comment-list.component';
import { JobApplication, PIPELINE_STATUSES, STATUS_LABELS, STATUS_COLORS, ApplicationStatus } from '../models/job-application.model';
import { TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '../../tasks/models/task.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, StatusBadgeComponent, TaskStatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent, CommentListComponent, IconComponent],
  templateUrl: './application-detail.page.html',
  styleUrl: './application-detail.page.scss'
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private appService = inject(ApplicationsService);
  private tasksService = inject(TasksService);

  app = signal<JobApplication | null>(null);
  loading = signal(true);
  showConfirm = signal(false);

  linkedTasks = computed(() => {
    const application = this.app();
    if (!application) return [];
    return this.tasksService.getByApplicationId(application.id);
  });

  TYPE_LABELS = TASK_TYPE_LABELS;
  TYPE_COLORS = TASK_TYPE_COLORS;

  pipelineStatuses = PIPELINE_STATUSES;
  STATUS_LABELS = STATUS_LABELS;
  STATUS_COLORS = STATUS_COLORS;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const application = await this.appService.getById(id);
    this.app.set(application);
    this.loading.set(false);
  }

  goBack() {
    this.location.back();
  }

  isStageActive(currentStatus: ApplicationStatus, stage: ApplicationStatus): boolean {
    const order = PIPELINE_STATUSES;
    return order.indexOf(stage) <= order.indexOf(currentStatus);
  }

  async deleteApp(id: string) {
    await this.appService.remove(id);
    this.router.navigate(['/applications']);
  }
}
