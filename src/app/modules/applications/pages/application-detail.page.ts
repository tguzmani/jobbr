import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApplicationsService } from '../services/applications.service';
import { StatusBadgeComponent } from '../components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { CommentListComponent } from '../../comments/components/comment-list/comment-list.component';
import { JobApplication, PIPELINE_STATUSES, STATUS_LABELS, STATUS_COLORS, ApplicationStatus } from '../models/job-application.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, StatusBadgeComponent, LoadingSpinnerComponent, ConfirmDialogComponent, CommentListComponent],
  templateUrl: './application-detail.page.html',
  styleUrl: './application-detail.page.scss'
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appService = inject(ApplicationsService);

  app = signal<JobApplication | null>(null);
  loading = signal(true);
  showConfirm = signal(false);

  pipelineStatuses = PIPELINE_STATUSES;
  STATUS_LABELS = STATUS_LABELS;
  STATUS_COLORS = STATUS_COLORS;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const application = await this.appService.getById(id);
    this.app.set(application);
    this.loading.set(false);
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
