import { Component, input } from '@angular/core';
import { TaskStatus, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../models/task.model';

@Component({
  selector: 'app-task-status-badge',
  standalone: true,
  templateUrl: './task-status-badge.component.html',
  styleUrl: './task-status-badge.component.scss'
})
export class TaskStatusBadgeComponent {
  status = input.required<TaskStatus>();

  color = () => TASK_STATUS_COLORS[this.status()] + '22';
  textColor = () => TASK_STATUS_COLORS[this.status()];
  label = () => TASK_STATUS_LABELS[this.status()];
}
