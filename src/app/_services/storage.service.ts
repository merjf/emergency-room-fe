import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'current-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  private archiveSelected = new BehaviorSubject(null);
  private currentArchiveSelected = this.archiveSelected.asObservable();

  signOut(): void {
    window.sessionStorage.clear();
  }

  public clearSession(): void{
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveCurrentUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  
  public getCurrentUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getArchiveSelected(): any{
    return this.currentArchiveSelected;
  }
  
  public saveArchivedSelected(archive: any) {
    this.archiveSelected.next(archive)
  }
}