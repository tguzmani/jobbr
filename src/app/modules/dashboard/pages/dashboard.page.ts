import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationsService } from '../../applications/services/applications.service';
import { AppCardComponent } from '../../applications/components/app-card/app-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PIPELINE_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../applications/models/job-application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, AppCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardComponent {
  appService = inject(ApplicationsService);

  recentApps = computed(() => this.appService.applications().slice(0, 5));

  stats = computed(() => {
    const byStatus = this.appService.byStatus();
    const total = this.appService.applications().length;
    const inProgress = byStatus['screening'].length + byStatus['interview'].length;
    return [
      { label: 'Total', count: total, color: '#E8E8E8', percent: 100,
        icon: 'M3 3v18h18M7 17V13M11 17V9M15 17V5M19 17v-4' },
      { label: 'Applied', count: byStatus['applied'].length, color: '#0A66C2',
        percent: total > 0 ? Math.round((byStatus['applied'].length / total) * 100) : 0,
        icon: 'M22 2L11 13 22 2zM22 2l-7 20-4-9-9-4 20-7z' },
      { label: 'In Progress', count: inProgress, color: '#E8A838',
        percent: total > 0 ? Math.round((inProgress / total) * 100) : 0,
        icon: 'M12 2a10 10 0 0 1 10 10h-10V2zM12 12a10 10 0 1 1 0-10' },
      { label: 'Offers', count: byStatus['offer'].length, color: '#5CB85C',
        percent: total > 0 ? Math.round((byStatus['offer'].length / total) * 100) : 0,
        icon: 'M12 2a10 10 0 1 0 10 10M22 4L12 14.01l-3-3' },
      { label: 'Rejected', count: byStatus['rejected'].length, color: '#CC1016',
        percent: total > 0 ? Math.round((byStatus['rejected'].length / total) * 100) : 0,
        icon: 'M12 2a10 10 0 1 0 10 10M15 9l-6 6M9 9l6 6' }
    ];
  });

  pipelineData = computed(() => {
    const byStatus = this.appService.byStatus();
    const total = this.appService.applications().length;
    return PIPELINE_STATUSES.map(status => ({
      status,
      label: STATUS_LABELS[status],
      count: byStatus[status].length,
      percent: total > 0 ? (byStatus[status].length / total) * 100 : 0,
      color: STATUS_COLORS[status]
    }));
  });
}
