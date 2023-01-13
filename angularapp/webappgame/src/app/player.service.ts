import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Player } from './player';
import { HashLocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseURL = "http://localhost:8080/api/player";

  constructor(private httpClient: HttpClient) { }

  getPlayerList(token: String | null): Observable<Player[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.get<Player[]>(`${this.baseURL}`, {
      headers: headers
    });
  }

  createPlayer(player: Object, token: String | null): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.post(`${this.baseURL}`, player, {
      headers: headers
    })
  }

  getPlayerById(id: number, token: String | null): Observable<Player> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.get<Player>(`${this.baseURL}/${id}`, {
      headers: headers
    })
  }

  getPlayerByEmail(email: String, token: String | null): Observable<Player> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.get<Player>(`http://localhost:8080/api/em/${email}`, {
      headers: headers
    })
  }

  updatePlayer(id: number, player: Player, token: String | null): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.put(`${this.baseURL}/${id}`, player, {
      headers: headers
    });
  }

  deletePlayer(id: number, token: String | null): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    return this.httpClient.delete(`${this.baseURL}/${id}`, {
      headers: headers
    });
  }
}
