import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const API_URL = 'http://localhost:8080/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getUserList(): Observable<any> {
    return this.http.get(API_URL + 'all');
  }

  createUser(body: any): Observable<any> {
    return this.http.post(API_URL + 'create', body);
  }

  changePassword(password: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.set('password', password);
    return this.http.post(API_URL + 'change-password', null, {params: params});
  }

  mapRoleToAuthority(roles: any){
    let role = Array.isArray(roles) && roles.length === 1 ? roles[0] : roles;
    if(role === 'Administrator')
      return "ROLE_ADMIN";
    else if(role === 'Researcher')
      return 'ROLE_RESEARCHER'
    else if(role === 'ROLE_ADMIN')
      return 'Administrator'
    else if(role === 'ROLE_RESEARCHER')
      return 'Researcher'
    else return "";
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn | null {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null as any;
      }
  
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
  
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null as any : error;
    }
  }
}