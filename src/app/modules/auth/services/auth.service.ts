import { Injectable, Injector, runInInjectionContext, signal, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Unsubscribe
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private auth = inject(Auth);
  private router = inject(Router);
  private injector = inject(Injector);
  private unsubscribe: Unsubscribe;

  currentUser = signal<User | null>(null);
  isLoading = signal(true);

  constructor() {
    this.unsubscribe = runInInjectionContext(this.injector, () =>
      onAuthStateChanged(this.auth, (user) => {
        const wasLoggedIn = this.currentUser() !== null;
        this.currentUser.set(user);
        this.isLoading.set(false);

        if (wasLoggedIn && !user) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  async signInWithGoogle(): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/dashboard']);
    });
  }

  async signOut(): Promise<void> {
    await runInInjectionContext(this.injector, () => signOut(this.auth));
  }
}
