import { Injectable, Injector, runInInjectionContext, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  updateDoc,
  increment,
  doc,
  query,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { TaskComment } from '../models/task-comment.model';

@Injectable({ providedIn: 'root' })
export class TaskCommentsService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private injector = inject(Injector);
  private subscription: Subscription | null = null;

  comments = signal<TaskComment[]>([]);
  isLoading = signal(false);

  loadComments(taskId: string) {
    this.subscription?.unsubscribe();
    this.isLoading.set(true);

    const userId = this.authService.currentUser()?.uid;
    if (!userId) return;

    runInInjectionContext(this.injector, () => {
      const colRef = collection(this.firestore, `users/${userId}/tasks/${taskId}/comments`);
      const q = query(colRef, orderBy('createdAt', 'desc'));

      this.subscription = collectionData(q, { idField: 'id' }).subscribe({
        next: (comments) => {
          this.comments.set(comments as TaskComment[]);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    });
  }

  async add(taskId: string, text: string): Promise<void> {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');

    return runInInjectionContext(this.injector, async () => {
      const colRef = collection(this.firestore, `users/${userId}/tasks/${taskId}/comments`);
      await addDoc(colRef, {
        text,
        createdAt: Timestamp.now()
      });
      const taskRef = doc(this.firestore, `users/${userId}/tasks/${taskId}`);
      await updateDoc(taskRef, { commentCount: increment(1) });
    });
  }

  async remove(taskId: string, commentId: string): Promise<void> {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');

    const current = this.comments();
    this.comments.set(current.filter(c => c.id !== commentId));

    try {
      await runInInjectionContext(this.injector, async () => {
        const ref = doc(this.firestore, `users/${userId}/tasks/${taskId}/comments/${commentId}`);
        await deleteDoc(ref);
        const taskRef = doc(this.firestore, `users/${userId}/tasks/${taskId}`);
        await updateDoc(taskRef, { commentCount: increment(-1) });
      });
    } catch {
      this.comments.set(current);
      throw new Error('Failed to delete comment');
    }
  }

  unsubscribe() {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.comments.set([]);
  }
}
