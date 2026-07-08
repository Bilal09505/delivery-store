import { Injectable, signal } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { auth } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null);
  ready = signal(false);

  constructor(private router: Router) {
    onAuthStateChanged(auth, (u) => {
      this.user.set(u);
      this.ready.set(true);
    });
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    this.router.navigate(['/orders']);
  }

  async logout() {
    await signOut(auth);
    this.router.navigate(['/login']);
  }
}
