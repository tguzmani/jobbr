import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ApplicationsService } from '../../services/applications.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { sentimentEmoji } from '../../../comments/models/comment.model';
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  ApplicationStatus,
  JobApplication
} from '../../models/job-application.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DragDropModule, IconComponent],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent {
  private appService = inject(ApplicationsService);

  statuses = APPLICATION_STATUSES;
  STATUS_LABELS = STATUS_LABELS;
  STATUS_COLORS = STATUS_COLORS;

  columns = computed(() => {
    const byStatus = this.appService.byStatus();
    return APPLICATION_STATUSES.map(status => ({
      status,
      label: STATUS_LABELS[status],
      color: STATUS_COLORS[status],
      apps: byStatus[status]
    }));
  });

  sentimentEmoji = sentimentEmoji;
  connectedLists = APPLICATION_STATUSES.map(s => `column-${s}`);

  getColumnId(status: ApplicationStatus): string {
    return `column-${status}`;
  }

  async onDrop(event: CdkDragDrop<JobApplication[]>, targetStatus: ApplicationStatus) {
    const app: JobApplication = event.item.data;
    if (app.status === targetStatus) return;
    await this.appService.update(app.id, { status: targetStatus });
  }
}
