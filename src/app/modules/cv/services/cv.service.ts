import { Injectable, Injector, runInInjectionContext, signal, inject, OnDestroy, effect } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Subscription, firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { OpenRouterService } from '../../../shared/services/openrouter.service';
import { CV } from '../models/cv.model';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

@Injectable({ providedIn: 'root' })
export class CvService implements OnDestroy {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private openRouter = inject(OpenRouterService);
  private injector = inject(Injector);
  private subscription: Subscription | null = null;

  cvs = signal<CV[]>([]);
  isLoading = signal(false);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      this.subscription?.unsubscribe();
      this.subscription = null;

      if (user) {
        this.subscribeToCvs(user.uid);
      } else {
        this.cvs.set([]);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private subscribeToCvs(userId: string) {
    this.isLoading.set(true);
    runInInjectionContext(this.injector, () => {
      const colRef = collection(this.firestore, `users/${userId}/cvs`);
      const q = query(colRef, orderBy('createdAt', 'desc'));

      this.subscription = collectionData(q, { idField: 'id' }).subscribe({
        next: (docs) => {
          this.cvs.set(docs as CV[]);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('CV subscription error:', err);
          this.isLoading.set(false);
        }
      });
    });
  }

  private getCollectionRef() {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) throw new Error('Not authenticated');
    return collection(this.firestore, `users/${userId}/cvs`);
  }

  async extractTextFromPdf(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str as string)
        .join(' ');
      pages.push(text);
    }

    return pages.join('\n');
  }

  async upload(file: File, name: string): Promise<string> {
    const content = await this.extractTextFromPdf(file);
    const embedding = await firstValueFrom(this.openRouter.generateEmbedding(content));

    return runInInjectionContext(this.injector, async () => {
      const now = Timestamp.now();
      const docRef = await addDoc(this.getCollectionRef(), {
        name,
        filename: file.name,
        content,
        embedding,
        createdAt: now
      });
      return docRef.id;
    });
  }

  async remove(id: string): Promise<void> {
    const current = this.cvs();
    this.cvs.set(current.filter(c => c.id !== id));
    try {
      await runInInjectionContext(this.injector, () => {
        const userId = this.authService.currentUser()?.uid;
        if (!userId) throw new Error('Not authenticated');
        return deleteDoc(doc(this.firestore, `users/${userId}/cvs/${id}`));
      });
    } catch {
      this.cvs.set(current);
      throw new Error('Failed to delete CV');
    }
  }
}
