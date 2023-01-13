import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/local-storage.service';
import { PlayerService } from 'src/app/player.service';
import { Player } from 'src/app/player';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent {
  players: Player[];
  playerUser: Player = new Player();
  token: String | null;

  constructor(private playerService: PlayerService,
    private router: Router,
    private localStorage: LocalStorageService) {

  }

  ngOnInit() {
    this.token = this.localStorage.get("token");
    let obj: any = this.localStorage.get("player");
    if (obj != null) {
      this.playerUser = JSON.parse(obj);
      console.log(this.playerUser);
    }
    else {
      alert("YOU ARE NOT LOGGED IN!");
      this.router.navigate(['user-login-create']);
    }

    this.getPlayers();
  }

  private getPlayers() {
    this.playerService.getPlayerList(this.token).subscribe({
      next: data => { this.players = data; },
      error: error => {
        this.router.navigate(['/user-login-create']);
        console.log(error);
      }
    });
  }

  updatePlayer(id: number) {
    this.router.navigate(['update-player', id])
  }

  updateStats(id: number) {
    this.router.navigate(['update-stats', id])
  }

  deletePlayer(id: number) {
    this.playerService.deletePlayer(id, this.token).subscribe({
      next: data => {
        window.location.reload();
        console.log(data);
      },
      error: error => {
        alert("YOU DON'T HAVE ADMIN RIGHTS!");
        console.log(error);
        window.location.reload();
      }
    });;
  }
}
