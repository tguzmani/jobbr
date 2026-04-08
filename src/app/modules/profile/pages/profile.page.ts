import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UserProfile, PROFILE_FIELDS } from '../models/user-profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, LoadingSpinnerComponent],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
})
export class ProfileComponent implements OnInit {
  profileService = inject(ProfileService);
  fields = PROFILE_FIELDS;

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

  async copyToClipboard(key: string, value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    this.copiedKey.set(key);
    setTimeout(() => this.copiedKey.set(null), 1500);
  }
}
