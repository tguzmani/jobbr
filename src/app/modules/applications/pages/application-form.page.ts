import { Component, inject, signal, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationsService } from '../services/applications.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { APPLICATION_STATUSES, STATUS_LABELS, STATUS_COLORS, ApplicationStatus } from '../models/job-application.model';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './application-form.page.html',
  styleUrl: './application-form.page.scss'
})
export class ApplicationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appService = inject(ApplicationsService);

  isEdit = signal(false);
  saving = signal(false);
  tags = signal<string[]>([]);
  editId = '';

  statuses = APPLICATION_STATUSES;
  STATUS_LABELS = STATUS_LABELS;

  goBack() {
    this.location.back();
  }

  getStatusColor(): string {
    const val = this.form.get('status')?.value as ApplicationStatus;
    return STATUS_COLORS[val] || '#A8A8A8';
  }

  form: FormGroup = this.fb.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    location: ['', Validators.required],
    source: ['', Validators.required],
    status: ['applied' as ApplicationStatus],
    currency: ['USD'],
    salaryMin: [null],
    salaryMax: [null],
    jobUrl: [''],
    notes: ['']
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId = id;
      const app = await this.appService.getById(id);
      if (app) {
        this.form.patchValue({
          company: app.company,
          role: app.role,
          location: app.location,
          source: app.source,
          status: app.status,
          currency: app.currency,
          salaryMin: app.salaryMin,
          salaryMax: app.salaryMax,
          jobUrl: app.jobUrl || '',
          notes: app.notes || ''
        });
        this.tags.set([...app.tags]);
      }
    }
  }

  addTag(event: Event) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(',', '').trim();
    if (value && !this.tags().includes(value)) {
      this.tags.set([...this.tags(), value]);
    }
    input.value = '';
  }

  removeTag(tag: string) {
    this.tags.set(this.tags().filter(t => t !== tag));
  }

  async save() {
    if (this.form.invalid) return;
    this.saving.set(true);

    const formVal = this.form.value;

    const data = {
      company: formVal.company,
      role: formVal.role,
      location: formVal.location,
      source: formVal.source,
      status: formVal.status,
      currency: formVal.currency,
      tags: this.tags(),
      ...(formVal.salaryMin ? { salaryMin: formVal.salaryMin } : {}),
      ...(formVal.salaryMax ? { salaryMax: formVal.salaryMax } : {}),
      ...(formVal.jobUrl ? { jobUrl: formVal.jobUrl } : {}),
      ...(formVal.notes ? { notes: formVal.notes } : {}),
    };

    try {
      if (this.isEdit()) {
        await this.appService.update(this.editId, data);
        this.router.navigate(['/applications', this.editId]);
      } else {
        const id = await this.appService.add(data);
        this.router.navigate(['/applications', id]);
      }
    } catch {
      this.saving.set(false);
    }
  }
}
