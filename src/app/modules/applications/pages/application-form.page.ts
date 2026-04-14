import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Location, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationsService } from '../services/applications.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ApplicationStatus, SalaryPeriod, SALARY_PERIOD_LABELS } from '../models/job-application.model';

const LOCATION_TYPES = ['Remote', 'Hybrid', 'On-site'] as const;
type LocationType = typeof LOCATION_TYPES[number];

const SOURCE_OPTIONS = ['LinkedIn', 'Indeed', 'Glassdoor', 'Wellfound', 'Company Website', 'Referral', 'Other'] as const;

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
  locationTypes = LOCATION_TYPES;
  sourceOptions = SOURCE_OPTIONS;

  goBack() {
    this.location.back();
  }

  form: FormGroup = this.fb.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    locationType: ['Remote' as LocationType],
    locationCity: [''],
    source: ['LinkedIn'],
    sourceCustom: [''],
    currency: ['USD'],
    salaryPeriod: ['yearly' as SalaryPeriod],
    salaryMin: [null],
    salaryMax: [null],
    jobUrl: ['']
  });

  get resolvedLocation(): string {
    const type = this.form.get('locationType')?.value as LocationType;
    const city = (this.form.get('locationCity')?.value || '').trim();
    if (type === 'Remote') return city ? `Remote — ${city}` : 'Remote';
    return city ? `${type} — ${city}` : type;
  }

  get resolvedSource(): string {
    const source = this.form.get('source')?.value;
    if (source === 'Other') return (this.form.get('sourceCustom')?.value || '').trim();
    return source;
  }

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
        // Parse location back into type + city
        let locationType: LocationType = 'On-site';
        let locationCity = app.location;
        for (const type of LOCATION_TYPES) {
          if (app.location.startsWith(type)) {
            locationType = type;
            locationCity = app.location.replace(new RegExp(`^${type}(\\s*—\\s*)?`), '').trim();
            break;
          }
        }

        // Parse source back
        const knownSource = SOURCE_OPTIONS.find(s => s === app.source);
        const source = knownSource ?? 'Other';
        const sourceCustom = knownSource ? '' : app.source;

        this.form.patchValue({
          company: app.company,
          role: app.role,
          locationType,
          locationCity,
          source,
          sourceCustom,
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
    if (this.form.get('source')?.value === 'Other' && !this.resolvedSource) return;
    this.saving.set(true);

    const formVal = this.form.value;

    const data = {
      company: formVal.company,
      role: formVal.role,
      location: this.resolvedLocation,
      source: this.resolvedSource,
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
