import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = "http://localhost:8080/api/auth";

  constructor(private httpClient: HttpClient) { }

  registerPlayer(playerWithPass: Object): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/register`, playerWithPass);
  }

  authenticatePlayer(playerWithPass: Object): Observable<Player> {
    return this.httpClient.post<Player>(`${this.baseURL}/authenticate`, playerWithPass);
  }

  // {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // }

  // createPlayer(player: Player): Observable<Object> {
  //   return this.httpClient.post(`${this.baseURL}`, player)
  // }

  // getPlayerById(id: number): Observable<Player> {
  //   return this.httpClient.get<Player>(`${this.baseURL}/${id}`)
  // }

  // updatePlayer(id: number, player: Player): Observable<Object> {
  //   console.log(player);
  //   return this.httpClient.put(`${this.baseURL}/${id}`, player);
  // }

}
