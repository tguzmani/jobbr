import { Injectable, Injector, runInInjectionContext, signal, computed, inject, OnDestroy, effect } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { JobApplication, ApplicationStatus } from '../models/job-application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationsService implements OnDestroy {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private injector = inject(Injector);
  private subscription: Subscription | null = null;

  applications = signal<JobApplication[]>([]);
  isLoading = signal(false);

  byStatus = computed(() => {
    const apps = this.applications();
    const grouped: Record<ApplicationStatus, JobApplication[]> = {
      applied: [],
      screening: [],
      interview: [],
      offer: [],
      rejected: [],
      withdrawn: []
    };
    apps.forEach(app => grouped[app.status].push(app));
    return grouped;
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      this.subscription?.unsubscribe();
      this.subscription = null;

      if (user) {
        this.subscribeToApplications(user.uid);
      } else {
        this.applications.set([]);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private subscribeToApplications(userId: string) {
    this.isLoading.set(true);
    runInInjectionContext(this.injector, () => {
      const colRef = collection(this.firestore, `users/${userId}/applications`);
      const q = query(colRef, orderBy('updatedAt', 'desc'));

      this.subscription = collectionData(q, { idField: 'id' }).subscribe({
        next: (apps) => {
          this.applications.set(apps as JobApplication[]);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Firestore subscription error:', err);
          this.isLoading.set(false);
        }
      });
    });
  }

  private getCollectionRef() {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');
    return collection(this.firestore, `users/${userId}/applications`);
  }

  private getDocRef(id: string) {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');
    return doc(this.firestore, `users/${userId}/applications/${id}`);
  }

  async add(data: Omit<JobApplication, 'id' | 'appliedAt' | 'updatedAt'>): Promise<string> {
    return runInInjectionContext(this.injector, async () => {
      const now = Timestamp.now();
      const docRef = await addDoc(this.getCollectionRef(), {
        ...data,
        appliedAt: now,
        updatedAt: now
      });
      return docRef.id;
    });
  }

  async update(id: string, data: Partial<JobApplication>): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = this.getDocRef(id);
      await updateDoc(ref, {
        ...data,
        updatedAt: Timestamp.now()
      });
    });
  }

  async remove(id: string): Promise<void> {
    const current = this.applications();
    this.applications.set(current.filter(a => a.id !== id));
    try {
      await runInInjectionContext(this.injector, () => deleteDoc(this.getDocRef(id)));
    } catch {
      this.applications.set(current);
      throw new Error('Failed to delete application');
    }
  }

  async getById(id: string): Promise<JobApplication | null> {
    return runInInjectionContext(this.injector, async () => {
      const ref = this.getDocRef(id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as JobApplication;
    });
  }
}
