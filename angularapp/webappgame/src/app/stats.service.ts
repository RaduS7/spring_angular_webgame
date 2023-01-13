import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from './player';
import { PlayerStats } from './player-stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private baseURL = "http://localhost:8080/api/stats";

  constructor(private httpClient: HttpClient) { }

  getStatsById(id: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.get<PlayerStats>(`${this.baseURL}/${id}`, {
      headers: headers
    });
  }

  updateStats(id: number, playerStats: PlayerStats, token: String | null): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.put(`${this.baseURL}/${id}`, playerStats, {
      headers: headers
    });
  }

  // registerPlayer(playerWithPass: Object): Observable<Object> {
  //   return this.httpClient.post(`${this.baseURL}/register`, playerWithPass);
  // }

  // authenticatePlayer(playerWithPass: Object): Observable<PlayerStats> {
  //   return this.httpClient.post<Player>(`${this.baseURL}/authenticate`, playerWithPass);
  // }

}
