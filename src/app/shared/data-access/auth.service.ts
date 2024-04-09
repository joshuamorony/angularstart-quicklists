import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Subject, of, Observable, EMPTY, merge } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

type Status =
  | 'initial'
  | 'authenticating'
  | 'authenticated'
  | 'fail'
  | 'unauthenticated';

interface AuthState {
  status: Status;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  public login$ = new Subject<string>();
  public logout$ = new Subject<void>();

  private loginStatus$: Observable<Status> = this.login$.pipe(
    switchMap((password) =>
      this.http
        .post(`${environment.API_URL}/login`, JSON.stringify({ password }))
        .pipe(
          map(() => 'authenticated' as const),
          catchError(() => of('fail' as const)),
          startWith('authenticating' as const),
        ),
    ),
  );

  private logoutStatus$: Observable<Status> = this.logout$.pipe(
    switchMap(() =>
      this.http.post(`${environment.API_URL}/logout`, {}).pipe(
        map(() => 'unauthenticated' as const),
        catchError(() => EMPTY),
      ),
    ),
  );

  // state
  private state = signal<AuthState>({
    status: 'initial',
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    merge(this.loginStatus$, this.logoutStatus$)
      .pipe(takeUntilDestroyed())
      .subscribe((status) =>
        this.state.update((state) => ({ ...state, status })),
      );

    effect(() => {
      const status = this.status();

      if (status === 'initial' || status === 'unauthenticated') {
        this.router.navigate(['login']);
      }

      if (status === 'authenticated') {
        this.router.navigate(['home']);
      }
    });
  }
}
