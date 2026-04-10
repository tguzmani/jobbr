import { Component, input, output, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
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

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.open()) return;
    const num = parseInt(event.key, 10);
    if (num >= 1 && num <= this.statuses.length) {
      event.preventDefault();
      event.stopPropagation();
      const target = this.statuses[num - 1];
      if (target !== this.status()) {
        this.statusChange.emit(target);
      }
      this.open.set(false);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.open.set(false);
    }
  }

  toggle(event: Event) {
    if (!this.editable()) return;
    event.preventDefault();
    event.stopPropagation();
    if (!this.open()) {
      this.positionDropdown();
    }
    this.open.set(!this.open());
  }

  /** Open the dropdown programmatically (used by keyboard shortcut on hover) */
  openDropdown() {
    if (!this.editable() || this.open()) return;
    this.positionDropdown();
    this.open.set(true);
  }

  select(status: ApplicationStatus, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (status !== this.status()) {
      this.statusChange.emit(status);
    }
    this.open.set(false);
  }

  closeDropdown(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.open.set(false);
  }

  private positionDropdown() {
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
}
