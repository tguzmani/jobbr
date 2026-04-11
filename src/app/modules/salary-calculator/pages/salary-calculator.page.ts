import { Component, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';

type SalaryPeriod = 'hourly' | 'monthly' | 'yearly';

const HOURS_PER_YEAR = 2080; // 40 hrs/week * 52 weeks
const MONTHS_PER_YEAR = 12;

@Component({
  selector: 'app-salary-calculator',
  standalone: true,
  imports: [FormsModule, DecimalPipe, IconComponent],
  templateUrl: './salary-calculator.page.html',
  styleUrl: './salary-calculator.page.scss'
})
export class SalaryCalculatorComponent {
  fromValue = signal<number | null>(null);
  fromPeriod = signal<SalaryPeriod>('yearly');
  toPeriod = signal<SalaryPeriod>('monthly');

  toValue = computed(() => {
    const value = this.fromValue();
    if (value === null || value === 0) return null;

    const yearlyValue = this.toYearly(value, this.fromPeriod());
    return this.fromYearly(yearlyValue, this.toPeriod());
  });

  onFromValueChange(value: string): void {
    const num = parseFloat(value);
    this.fromValue.set(isNaN(num) ? null : num);
  }

  onFromPeriodChange(period: string): void {
    this.fromPeriod.set(period as SalaryPeriod);
  }

  onToPeriodChange(period: string): void {
    this.toPeriod.set(period as SalaryPeriod);
  }

  swap(): void {
    const currentToValue = this.toValue();
    const currentFromPeriod = this.fromPeriod();
    const currentToPeriod = this.toPeriod();

    this.fromPeriod.set(currentToPeriod);
    this.toPeriod.set(currentFromPeriod);
    this.fromValue.set(currentToValue);
  }

  private toYearly(value: number, period: SalaryPeriod): number {
    switch (period) {
      case 'hourly': return value * HOURS_PER_YEAR;
      case 'monthly': return value * MONTHS_PER_YEAR;
      case 'yearly': return value;
    }
  }

  private fromYearly(yearly: number, period: SalaryPeriod): number {
    switch (period) {
      case 'hourly': return yearly / HOURS_PER_YEAR;
      case 'monthly': return yearly / MONTHS_PER_YEAR;
      case 'yearly': return yearly;
    }
  }
}
