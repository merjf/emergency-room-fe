import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/archive/';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  constructor(private http: HttpClient) { }

  getAllArchives(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'json' });
  }

  getMyArchives(): Observable<any> {
    return this.http.get(API_URL + 'my-archives', { responseType: 'json' });
  }

}