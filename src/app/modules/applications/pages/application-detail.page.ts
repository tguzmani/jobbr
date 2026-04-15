import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApplicationsService } from '../services/applications.service';
import { AtsService } from '../services/ats.service';
import { TasksService } from '../../tasks/services/tasks.service';
import { StatusBadgeComponent } from '../components/status-badge/status-badge.component';
import { TaskStatusBadgeComponent } from '../../tasks/components/task-status-badge/task-status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { CommentListComponent } from '../../comments/components/comment-list/comment-list.component';
import { JobApplication, PIPELINE_STATUSES, STATUS_LABELS, STATUS_COLORS, ApplicationStatus } from '../models/job-application.model';
import { ATSAnalysisResult } from '../models/ats-analysis.model';
import { TASK_TYPE_LABELS, TASK_TYPE_COLORS, TaskStatus } from '../../tasks/models/task.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, FormsModule, StatusBadgeComponent, TaskStatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent, CommentListComponent, IconComponent],
  templateUrl: './application-detail.page.html',
  styleUrl: './application-detail.page.scss'
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private appService = inject(ApplicationsService);
  private atsService = inject(AtsService);
  private tasksService = inject(TasksService);

  app = signal<JobApplication | null>(null);
  loading = signal(true);
  showConfirm = signal(false);

  jdText = signal('');
  analyzing = signal(false);
  analysisError = signal<string | null>(null);
  matchResult = signal<ATSAnalysisResult | null>(null);

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

    if (application?.jdText) {
      this.jdText.set(application.jdText);
    }
    if (application?.matchResult) {
      this.matchResult.set(application.matchResult);
    }
  }

  goBack() {
    this.location.back();
  }

  isStageActive(currentStatus: ApplicationStatus, stage: ApplicationStatus): boolean {
    const order = PIPELINE_STATUSES;
    return order.indexOf(stage) <= order.indexOf(currentStatus);
  }

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    await this.tasksService.update(taskId, { status });
  }

  async updateStatus(status: ApplicationStatus) {
    const application = this.app();
    if (!application) return;
    await this.appService.update(application.id, { status });
    this.app.set({ ...application, status });
  }

  async analyzeMatch() {
    const application = this.app();
    const jd = this.jdText();
    if (!application || !jd.trim()) return;

    this.analyzing.set(true);
    this.analysisError.set(null);

    try {
      const result = await this.atsService.analyze(application.id, jd);
      this.matchResult.set(result);
    } catch (err) {
      this.analysisError.set(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      this.analyzing.set(false);
    }
  }

  getDecisionColor(action: string): string {
    switch (action) {
      case 'APPLY_NOW': return '#5CB85C';
      case 'APPLY_AFTER_EDITS': return '#E8A838';
      case 'SKIP': return '#CC1016';
      default: return '#A8A8A8';
    }
  }

  getDecisionLabel(action: string): string {
    switch (action) {
      case 'APPLY_NOW': return 'Apply Now';
      case 'APPLY_AFTER_EDITS': return 'Apply After Edits';
      case 'SKIP': return 'Skip';
      default: return action;
    }
  }

  async deleteApp(id: string) {
    await this.appService.remove(id);
    this.router.navigate(['/applications']);
  }
}
