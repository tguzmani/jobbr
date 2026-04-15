import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { CV } from '../../models/cv.model';

@Component({
  selector: 'app-cv-card',
  standalone: true,
  imports: [DatePipe, IconComponent],
  templateUrl: './cv-card.component.html',
  styleUrl: './cv-card.component.scss'
})
export class CvCardComponent {
  cv = input.required<CV>();
  deleted = output<string>();
}
