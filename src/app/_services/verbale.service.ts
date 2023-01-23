import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/verbale/';

@Injectable({
  providedIn: 'root'
})
export class VerbaleService {

    constructor(private http: HttpClient) { }

    getVerbali(archive: number, filters: any, pagination: any): Observable<any> {
      let params: HttpParams = new HttpParams();
      params = params.set('archiveId', archive);
      let body = {
        filters: filters,
        pagination: pagination
      }
      return this.http.post(API_URL + 'all', body, {params: params});
    }

    downloadVerbale(archive: number, accesso: number){
      let params: HttpParams = new HttpParams();
      params = params.set('archiveId', archive);
      params = params.set('numeroAccesso', accesso);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/pdf',
      });
      let requestOptions = { headers: headers, params: params, responseType: 'blob' as 'blob'};
      return this.http.post(API_URL + 'print', null, requestOptions);
    }
}
