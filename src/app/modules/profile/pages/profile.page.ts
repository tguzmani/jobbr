import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CvListComponent } from '../../cv/pages/cv-list/cv-list.page';
import { UserProfile, PROFILE_FIELD_GROUPS, ProfileFieldGroup } from '../models/user-profile.model';

type ProfileTab = 'info' | 'cvs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, LoadingSpinnerComponent, IconComponent, CvListComponent],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
})
export class ProfileComponent implements OnInit {
  profileService = inject(ProfileService);
  groups = PROFILE_FIELD_GROUPS;

  activeTab = signal<ProfileTab>('info');

  editing = signal(false);
  saving = signal(false);
  copiedKey = signal<string | null>(null);
  formData = signal<UserProfile>({ ...this.profileService.profile() });

  async ngOnInit() {
    await this.profileService.load();
    this.formData.set({ ...this.profileService.profile() });
  }

  startEditing() {
    this.formData.set({ ...this.profileService.profile() });
    this.editing.set(true);
  }

  cancelEditing() {
    this.editing.set(false);
  }

  async saveProfile() {
    this.saving.set(true);
    try {
      await this.profileService.save(this.formData());
      this.editing.set(false);
    } finally {
      this.saving.set(false);
    }
  }

  updateField(key: keyof UserProfile, value: string) {
    this.formData.set({ ...this.formData(), [key]: value });
  }

  getComputedValue(group: ProfileFieldGroup, computedId: string): string {
    const cf = group.computedFields?.find(c => c.id === computedId);
    if (!cf) return '';
    const source = this.editing() ? this.formData() : this.profileService.profile();
    return cf.derive(source);
  }

  async copyToClipboard(key: string, value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    this.copiedKey.set(key);
    setTimeout(() => this.copiedKey.set(null), 1500);
  }
}
