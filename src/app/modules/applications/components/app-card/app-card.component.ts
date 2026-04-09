import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { JobApplication, ApplicationStatus } from '../../models/job-application.model';
import { ApplicationsService } from '../../services/applications.service';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, StatusBadgeComponent, IconComponent],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss'
})
export class AppCardComponent {
  private appService = inject(ApplicationsService);
  application = input.required<JobApplication>();

  async onStatusChange(status: ApplicationStatus) {
    await this.appService.update(this.application().id, { status });
  }
}
