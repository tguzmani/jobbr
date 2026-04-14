import { Component, input, output, signal, ElementRef, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { TaskStatus, TASK_STATUSES, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../models/task.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-task-status-badge',
  standalone: true,
  imports: [IconComponent, NgStyle],
  templateUrl: './task-status-badge.component.html',
  styleUrl: './task-status-badge.component.scss'
})
export class TaskStatusBadgeComponent {
  status = input.required<TaskStatus>();
  editable = input(false);
  statusChange = output<TaskStatus>();

  open = signal(false);
  dropdownStyle = signal<Record<string, string>>({});
  statuses = TASK_STATUSES;
  STATUS_LABELS = TASK_STATUS_LABELS;
  STATUS_COLORS = TASK_STATUS_COLORS;

  @ViewChild('badgeBtn') badgeBtn!: ElementRef<HTMLButtonElement>;

  color = () => TASK_STATUS_COLORS[this.status()] + '22';
  textColor = () => TASK_STATUS_COLORS[this.status()];
  label = () => TASK_STATUS_LABELS[this.status()];

  toggle(event: Event) {
    if (!this.editable()) return;
    event.preventDefault();
    event.stopPropagation();
    if (!this.open()) {
      const rect = this.badgeBtn.nativeElement.getBoundingClientRect();
      const dropdownWidth = 160;
      let left = rect.left;

      if (left + dropdownWidth > window.innerWidth - 8) {
        left = window.innerWidth - dropdownWidth - 8;
      }

      this.dropdownStyle.set({
        position: 'fixed',
        top: rect.bottom + 6 + 'px',
        left: left + 'px'
      });
    }
    this.open.set(!this.open());
  }

  select(status: TaskStatus, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (status !== this.status()) {
      this.statusChange.emit(status);
    }
    this.open.set(false);
  }

  closeDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.open.set(false);
  }
}
