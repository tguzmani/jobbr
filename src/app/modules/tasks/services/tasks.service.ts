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
  where,
  Timestamp
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService implements OnDestroy {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private injector = inject(Injector);
  private subscription: Subscription | null = null;

  tasks = signal<Task[]>([]);
  isLoading = signal(false);

  byStatus = computed(() => {
    const tasks = this.tasks();
    const grouped: Record<TaskStatus, Task[]> = {
      'to-do': [],
      'in-progress': [],
      'review': [],
      'accepted': [],
      'failed': []
    };
    tasks.forEach(t => grouped[t.status].push(t));
    return grouped;
  });

  upcomingTasks = computed(() => {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(now.getDate() + 7);
    now.setHours(0, 0, 0, 0);
    in7Days.setHours(23, 59, 59, 999);

    return this.tasks()
      .filter(t => {
        const due = t.dueDate.toDate();
        return due <= in7Days && t.status !== 'accepted' && t.status !== 'failed';
      })
      .sort((a, b) => a.dueDate.toMillis() - b.dueDate.toMillis());
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      this.subscription?.unsubscribe();
      this.subscription = null;

      if (user) {
        this.subscribeToTasks(user.uid);
      } else {
        this.tasks.set([]);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private subscribeToTasks(userId: string, retryCount = 0) {
    this.isLoading.set(true);
    runInInjectionContext(this.injector, () => {
      const colRef = collection(this.firestore, `users/${userId}/tasks`);
      const q = query(colRef, orderBy('updatedAt', 'desc'));

      this.subscription = collectionData(q, { idField: 'id' }).subscribe({
        next: (tasks) => {
          this.tasks.set(tasks as Task[]);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Tasks subscription error:', err);
          this.isLoading.set(false);
          if (retryCount < 3) {
            setTimeout(() => this.subscribeToTasks(userId, retryCount + 1), 2000 * (retryCount + 1));
          }
        }
      });
    });
  }

  private getCollectionRef() {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');
    return collection(this.firestore, `users/${userId}/tasks`);
  }

  private getDocRef(id: string) {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');
    return doc(this.firestore, `users/${userId}/tasks/${id}`);
  }

  async add(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return runInInjectionContext(this.injector, async () => {
      const now = Timestamp.now();
      const docRef = await addDoc(this.getCollectionRef(), {
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    });
  }

  async update(id: string, data: Partial<Task>): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = this.getDocRef(id);
      await updateDoc(ref, {
        ...data,
        updatedAt: Timestamp.now()
      });
    });
  }

  async remove(id: string): Promise<void> {
    const current = this.tasks();
    this.tasks.set(current.filter(t => t.id !== id));
    try {
      await runInInjectionContext(this.injector, () => deleteDoc(this.getDocRef(id)));
    } catch {
      this.tasks.set(current);
      throw new Error('Failed to delete task');
    }
  }

  async getById(id: string): Promise<Task | null> {
    return runInInjectionContext(this.injector, async () => {
      const ref = this.getDocRef(id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as Task;
    });
  }

  getByApplicationId(applicationId: string): Task[] {
    return this.tasks().filter(t => t.applicationId === applicationId);
  }
}
