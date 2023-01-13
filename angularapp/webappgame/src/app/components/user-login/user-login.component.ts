import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/local-storage.service';
import { AuthService } from 'src/app/auth.service';
import { Player } from 'src/app/player';
import { PlayerService } from 'src/app/player.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  player: Player = new Player();
  password: string;
  token: string | null = null;
  signIn: boolean = true;

  constructor(private authService: AuthService,
    private router: Router,
    private localStorage: LocalStorageService,
    private playerService: PlayerService
  ) {

  }

  ngOnInit() {
    this.token = this.localStorage.get("token");

    let obj: any = this.localStorage.get("player");
    if (obj != null) {
      this.player = JSON.parse(obj);
    }

    console.log(this.token);
  }

  onSubmitLogin() {
    const playerWithPass = {
      name: this.player.name,
      email: this.player.email,
      password: this.password
    }

    // if (playerWithPass.name == ""
    //   || playerWithPass.email == ""
    //   || playerWithPass.password == "") {
    //   alert("Fields can't be empty!");
    // }

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!this.player.email.match(validRegex)) {
      alert("EMAIL ADDRESS NOT VALID!");

      return;
    }

    if (!this.signIn) {
      this.authService.registerPlayer(playerWithPass).subscribe({
        next: data => {
          let obj: any = data;
          this.token = obj.token
          this.localStorage.set("token", obj.token);

          this.playerService.getPlayerByEmail(this.player.email, this.token).subscribe({
            next: data => {
              this.player = data;
              this.localStorage.set("player", JSON.stringify(this.player))
              console.log(this.player);

              window.location.reload();
            },
            error: error => console.log(error)
          })
        },
        error: error => { console.log(error); }
      })
    }
    else {
      this.authService.authenticatePlayer(playerWithPass).subscribe({
        next: data => {
          let obj: any = data;
          this.token = obj.token
          this.localStorage.set("token", obj.token);

          this.playerService.getPlayerByEmail(this.player.email, this.token).subscribe({
            next: data => {
              this.player = data;
              this.localStorage.set("player", JSON.stringify(this.player))
              console.log(this.player);

              window.location.reload();
            },
            error: error => console.log(error)
          })
        },
        error: error => {
          console.log(error);
          alert("INCORRECT CREDENTIALS");
        }
      })
    }
  }

  onSubmitLogout() {
    this.localStorage.remove("player");
    this.localStorage.remove("token");
    window.location.reload();
  }

  onClickSignIn() {
    this.signIn = true;
  }

  onClickSignUp() {
    this.signIn = false;
  }
}
