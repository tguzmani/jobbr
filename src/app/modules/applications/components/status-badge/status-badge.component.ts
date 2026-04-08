import { Component, input } from '@angular/core';
import { ApplicationStatus, STATUS_LABELS, STATUS_COLORS } from '../../models/job-application.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  status = input.required<ApplicationStatus>();

  color = () => STATUS_COLORS[this.status()] + '22';
  textColor = () => STATUS_COLORS[this.status()];
  label = () => STATUS_LABELS[this.status()];
}
