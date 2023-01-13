import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/local-storage.service';
import { PlayerService } from 'src/app/player.service';
import { Player } from 'src/app/player';

@Component({
  selector: 'app-update-player',
  templateUrl: './update-player.component.html',
  styleUrls: ['./update-player.component.css']
})
export class UpdatePlayerComponent {

  id: number;
  player: Player = new Player();
  playerUser: Player = new Player();
  token: String | null

  constructor(private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorage: LocalStorageService) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.token = this.localStorage.get("token");
    let obj: any = this.localStorage.get("player");
    if (obj != null) {
      this.playerUser = JSON.parse(obj);
      console.log(this.playerUser);
    }
    else {
      alert("YOU HAVE TO SIGN IN!");
      this.router.navigate(['user-login-create']);
    }

    this.playerService.getPlayerById(this.id, this.token).subscribe({
      next: data => { this.player = data },
      error: error => console.log(error)
    })
  }

  onSubmit() {
    let updatePlayer = {
      name: this.player.name,
      email: this.player.email,
      score: this.player.score,
      id: this.player.id,
      role: this.player.role,
      stats: this.player.stats
    }

    this.playerService.updatePlayer(this.id, updatePlayer, this.token).subscribe({
      next: data => {

        //IF WE UPDATE THE ACCOUNT WE'RE USING        

        this.playerService.getPlayerById(this.playerUser.id, this.token).subscribe({
          next: data => {
            if (this.playerUser.id == this.id) {
              this.playerUser = data
              this.localStorage.set("player", JSON.stringify(this.playerUser))
            }
            this.router.navigate(['/players']);
            console.log(data);
          },
          error: error => { console.log(error); }
        })

      },
      error: error => {
        alert("INVALID INPUT OR YOU DON'T HAVE ADMIN RIGHTS!");
        console.log(error);
      }
    });
  }

  goToPlayerList() {
    this.router.navigate(['/players']);
  }
}
