import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  loadChecklists() {
    return of();
  }
}
