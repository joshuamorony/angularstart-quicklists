import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, of, Observable, EMPTY, merge } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

type Status = 'initial' | 'authenticating' | 'authenticated' | 'fail';

interface AuthState {
  status: Status;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

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
        map(() => 'initial' as const),
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
  }
}
