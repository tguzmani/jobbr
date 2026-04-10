import { Component, input, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { JobApplication, ApplicationStatus } from '../../models/job-application.model';
import { ApplicationsService } from '../../services/applications.service';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { HoverItemService } from '../../../../shared/services/hover-item.service';
import { sentimentEmoji } from '../../../comments/models/comment.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, StatusBadgeComponent, IconComponent],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss'
})
export class AppCardComponent {
  private appService = inject(ApplicationsService);
  private hoverService = inject(HoverItemService);
  application = input.required<JobApplication>();
  sentimentEmoji = sentimentEmoji;

  @ViewChild(StatusBadgeComponent) statusBadge!: StatusBadgeComponent;

  onMouseEnter() {
    this.hoverService.register(this.statusBadge);
  }

  onMouseLeave() {
    this.hoverService.unregister(this.statusBadge);
  }

  async onStatusChange(status: ApplicationStatus) {
    await this.appService.update(this.application().id, { status });
  }
}
