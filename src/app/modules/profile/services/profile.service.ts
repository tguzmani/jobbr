import { Injectable, Injector, runInInjectionContext, inject, signal } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AuthService } from '../../auth/services/auth.service';
import { UserProfile, EMPTY_PROFILE } from '../models/user-profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private injector = inject(Injector);

  profile = signal<UserProfile>(EMPTY_PROFILE);
  isLoading = signal(false);

  private getDocRef() {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');
    return doc(this.firestore, `users/${userId}/profile/main`);
  }

  async load(): Promise<void> {
    this.isLoading.set(true);
    try {
      await runInInjectionContext(this.injector, async () => {
        const snap = await getDoc(this.getDocRef());
        if (snap.exists()) {
          this.profile.set({ ...EMPTY_PROFILE, ...snap.data() } as UserProfile);
        } else {
          this.profile.set(EMPTY_PROFILE);
        }
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  async save(data: UserProfile): Promise<void> {
    await runInInjectionContext(this.injector, async () => {
      await setDoc(this.getDocRef(), { ...data });
      this.profile.set(data);
    });
  }
}
