import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://192.168.250.63:8080/archive/';

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