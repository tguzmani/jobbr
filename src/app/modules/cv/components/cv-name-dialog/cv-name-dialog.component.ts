import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-cv-name-dialog',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './cv-name-dialog.component.html',
  styleUrl: './cv-name-dialog.component.scss'
})
export class CvNameDialogComponent {
  name = signal('');

  confirmed = output<string>();
  cancelled = output<void>();

  submit() {
    const trimmed = this.name().trim();
    if (trimmed) {
      this.confirmed.emit(trimmed);
    }
  }
}
