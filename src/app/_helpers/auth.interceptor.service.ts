import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';;

import { StorageService } from '../_services/storage.service';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private storageService: StorageService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    
    if(!req.url.includes('login')){
      const token = this.storageService.getToken();
      if(this.isTokenExpired(token)){
        this.storageService.signOut();
        const message: NavigationExtras = {state: {data: 'Sessione scaduta. Accedi di nuovo'}};
        this.router.navigate(['login'], message);
        return new Observable<HttpEvent<any>>();
      } else if (!this.isTokenPresent(token)) {
        this.storageService.signOut();
        this.router.navigate(['login']);
        return new Observable<HttpEvent<any>>();
      } else {
        authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
      }
    }
    
    return next.handle(authReq);
  }

  private isTokenPresent(token: any): boolean{
    return token != null;
  }

  private isTokenExpired(token: any) {
    if(token != null){
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }
    return false;
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];