import { Component, inject, signal, OnInit } from '@angular/core';
import { Location, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationsService } from '../services/applications.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApplicationStatus, SalaryPeriod, SALARY_PERIOD_LABELS } from '../models/job-application.model';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, DecimalPipe],
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
  editId = '';

  SALARY_PERIOD_LABELS = SALARY_PERIOD_LABELS;
  salaryPeriods: SalaryPeriod[] = ['yearly', 'monthly', 'hourly'];

  goBack() {
    this.location.back();
  }

  form: FormGroup = this.fb.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    location: ['', Validators.required],
    source: ['', Validators.required],
    currency: ['USD'],
    salaryPeriod: ['yearly' as SalaryPeriod],
    salaryMin: [null],
    salaryMax: [null],
    jobUrl: ['']
  });

  private toYearly(amount: number, period: SalaryPeriod): number {
    if (period === 'hourly') return Math.round(amount * 40 * 52);
    if (period === 'monthly') return Math.round(amount * 12);
    return amount;
  }

  get yearlyMin(): number | null {
    const val = this.form?.get('salaryMin')?.value;
    const period = this.form?.get('salaryPeriod')?.value as SalaryPeriod;
    if (!val || period === 'yearly') return null;
    return this.toYearly(val, period);
  }

  get yearlyMax(): number | null {
    const val = this.form?.get('salaryMax')?.value;
    const period = this.form?.get('salaryPeriod')?.value as SalaryPeriod;
    if (!val || period === 'yearly') return null;
    return this.toYearly(val, period);
  }

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
          currency: app.currency,
          salaryMin: app.salaryMin,
          salaryMax: app.salaryMax,
          jobUrl: app.jobUrl || ''
        });
      }
    }
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
      status: 'applied' as ApplicationStatus,
      currency: formVal.currency,
      tags: [] as string[],
      ...(formVal.salaryMin ? { salaryMin: this.toYearly(formVal.salaryMin, formVal.salaryPeriod) } : {}),
      ...(formVal.salaryMax ? { salaryMax: this.toYearly(formVal.salaryMax, formVal.salaryPeriod) } : {}),
      ...(formVal.jobUrl ? { jobUrl: formVal.jobUrl } : {}),
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
