import { Component, input, output, signal, ElementRef, ViewChild } from '@angular/core';
import { ApplicationStatus, APPLICATION_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../models/job-application.model';
import { NgStyle } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [IconComponent, NgStyle],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  status = input.required<ApplicationStatus>();
  editable = input(false);
  statusChange = output<ApplicationStatus>();

  open = signal(false);
  dropdownStyle = signal<Record<string, string>>({});
  statuses = APPLICATION_STATUSES;
  STATUS_LABELS = STATUS_LABELS;
  STATUS_COLORS = STATUS_COLORS;

  @ViewChild('badgeBtn') badgeBtn!: ElementRef<HTMLButtonElement>;

  color = () => STATUS_COLORS[this.status()] + '22';
  textColor = () => STATUS_COLORS[this.status()];
  label = () => STATUS_LABELS[this.status()];

  toggle(event: Event) {
    if (!this.editable()) return;
    event.preventDefault();
    event.stopPropagation();
    if (!this.open()) {
      const rect = this.badgeBtn.nativeElement.getBoundingClientRect();
      this.dropdownStyle.set({
        position: 'fixed',
        top: rect.bottom + 6 + 'px',
        left: rect.left + 'px'
      });
    }
    this.open.set(!this.open());
  }

  select(status: ApplicationStatus, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (status !== this.status()) {
      this.statusChange.emit(status);
    }
    this.open.set(false);
  }

  closeDropdown() {
    this.open.set(false);
  }
}
