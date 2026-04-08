import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { JobApplication } from '../../models/job-application.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, StatusBadgeComponent],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss'
})
export class AppCardComponent {
  application = input.required<JobApplication>();
}
