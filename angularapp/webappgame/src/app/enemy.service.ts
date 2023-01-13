import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnemyStats } from './enemy-stats';

@Injectable({
  providedIn: 'root'
})
export class EnemyService {

  private baseURL = "http://localhost:8080/api/enemies";

  constructor(private httpClient: HttpClient) { }

  getEnemyStats(token: string): Observable<EnemyStats[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.get<EnemyStats[]>(`${this.baseURL}`, {
      headers: headers
    });
  }
}
