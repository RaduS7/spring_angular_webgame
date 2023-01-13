import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/local-storage.service';
import { PlayerService } from 'src/app/player.service';
import { Player } from 'src/app/player';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.css']
})
export class CreatePlayerComponent {
  playerUser: Player = new Player();
  player: Player = new Player();
  token: String | null;
  password: String;

  constructor(private playerService: PlayerService,
    private router: Router,
    private localStorage: LocalStorageService) {

  }

  ngOnInit() {
    this.token = this.localStorage.get("token");

    let obj: any = this.localStorage.get("player");
    if (obj != null) {
      this.playerUser = JSON.parse(obj);

      if (this.playerUser.role != "ADMIN") {
        alert("YOU DON'T HAVE ADMIN RIGHTS!");
        this.router.navigate(['/user-login-create']);
      }

      console.log(this.playerUser);
    }
    else {
      alert("YOU ARE NOT LOGGED IN!");
      this.router.navigate(['/user-login-create']);
    }
  }

  savePlayer() {
    const playerWithPass = {
      name: this.player.name,
      email: this.player.email,
      score: this.player.score,
      password: this.password
    }

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!this.player.email.match(validRegex)) {
      alert("EMAIL ADDRESS NOT VALID!");

      return;
    }

    this.token = this.localStorage.get("token");

    this.playerService.createPlayer(playerWithPass, this.token).subscribe({
      next: data => {
        this.goToPlayerList();
      },
      error: error => {
        alert("YOU DON'T HAVE ADMIN RIGHTS!");
        this.router.navigate(['/players']);
        console.log(error);
      }
    })
  }

  goToPlayerList() {
    this.router.navigate(['/players']);
  }

  onSubmit() {
    this.savePlayer();
  }
}
