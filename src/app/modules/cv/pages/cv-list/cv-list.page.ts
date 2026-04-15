import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CvService } from '../../services/cv.service';
import { CvCardComponent } from '../../components/cv-card/cv-card.component';
import { CvNameDialogComponent } from '../../components/cv-name-dialog/cv-name-dialog.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-cv-list',
  standalone: true,
  imports: [CvCardComponent, CvNameDialogComponent, LoadingSpinnerComponent, EmptyStateComponent, IconComponent],
  templateUrl: './cv-list.page.html',
  styleUrl: './cv-list.page.scss'
})
export class CvListComponent {
  cvService = inject(CvService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploading = signal(false);
  error = signal<string | null>(null);
  showNameDialog = signal(false);
  pendingFile = signal<File | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.pendingFile.set(file);
    this.showNameDialog.set(true);
  }

  async onNameConfirmed(name: string) {
    const file = this.pendingFile();
    this.showNameDialog.set(false);
    this.pendingFile.set(null);
    if (!file) return;

    this.uploading.set(true);
    this.error.set(null);

    try {
      await this.cvService.upload(file, name);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      this.uploading.set(false);
      this.fileInput.nativeElement.value = '';
    }
  }

  onNameCancelled() {
    this.showNameDialog.set(false);
    this.pendingFile.set(null);
    this.fileInput.nativeElement.value = '';
  }

  async deleteCv(id: string) {
    try {
      await this.cvService.remove(id);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Delete failed');
    }
  }
}
