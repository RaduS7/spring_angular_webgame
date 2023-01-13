import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/local-storage.service';
import { Player } from 'src/app/player';
import { PlayerStats } from 'src/app/player-stats';
import { PlayerService } from 'src/app/player.service';
import { StatsService } from 'src/app/stats.service';

@Component({
  selector: 'app-update-stats',
  templateUrl: './update-stats.component.html',
  styleUrls: ['./update-stats.component.css']
})
export class UpdateStatsComponent {
  id: number;
  player: Player = new Player();
  playerUser: Player = new Player();
  stats: PlayerStats = new PlayerStats();
  statsUser: PlayerStats = new PlayerStats();
  token: string | null;
  sizes = {
    small: 50,
    medium: 60,
    large: 70
  }
  selectedSize: number;
  colors = {
    blue: 'blue',
    yellow: 'yellow',
    green: 'green'
  }
  selectedColor: string;

  constructor(private playerService: PlayerService,
    private statsService: StatsService,
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

    this.statsService.getStatsById(this.id, this.token).subscribe({
      next: data => {
        this.stats = data

        if (this.stats.playerSize == this.sizes.small)
          this.selectedSize = this.sizes.small;
        else if (this.stats.playerSize == this.sizes.medium)
          this.selectedSize = this.sizes.medium;
        else if (this.stats.playerSize == this.sizes.large)
          this.selectedSize = this.sizes.large;

        if (this.stats.playerColor == this.colors.blue)
          this.selectedColor = this.colors.blue;
        else if (this.stats.playerColor == this.colors.yellow)
          this.selectedColor = this.colors.yellow;
        else if (this.stats.playerColor == this.colors.green)
          this.selectedColor = this.colors.green;
      },
      error: error => {
        alert("YOU DON'T HAVE ADMIN RIGHTS!");
        this.router.navigate(['/players']);
        console.log(error);
      }
    })
  }

  onSpeed() {
    if (this.stats.playerMoney >= 50) {
      this.stats.playerSpeed += 0.02;
      this.stats.playerMoney -= 50;
      this.stats.playerSpeed = Math.round(this.stats.playerSpeed * 100) / 100;
      this.submitChanges();
    }
    else {
      alert("NOT ENOUGH MONEY!");
    }
  }

  onAttack() {
    if (this.stats.playerMoney >= 95) {
      this.stats.playerAttack += 0.05;
      this.stats.playerMoney -= 95;
      this.stats.playerAttack = Math.round(this.stats.playerAttack * 100) / 100;
      this.submitChanges();
    }
    else {
      alert("NOT ENOUGH MONEY!");
    }
  }

  onHp() {
    if (this.stats.playerMoney >= 75) {
      this.stats.playerHp += 10;
      this.stats.playerMoney -= 75;
      this.submitChanges();
    }
    else {
      alert("NOT ENOUGH MONEY!");
    }
  }

  sizeSmall() {
    this.selectedSize = this.sizes.small;
    this.stats.playerSize = this.selectedSize;
    this.submitChanges();
  }

  sizeMedium() {
    this.selectedSize = this.sizes.medium;
    this.stats.playerSize = this.selectedSize;
    this.submitChanges();
  }

  sizeLarge() {
    this.selectedSize = this.sizes.large;
    this.stats.playerSize = this.selectedSize;
    this.submitChanges();
  }

  colorBlue() {
    this.selectedColor = this.colors.blue;
    this.stats.playerColor = this.selectedColor;
    this.submitChanges();
  }

  colorYellow() {
    this.selectedColor = this.colors.yellow;
    this.stats.playerColor = this.selectedColor;
    this.submitChanges();
  }

  colorGreen() {
    this.selectedColor = this.colors.green;
    this.stats.playerColor = this.selectedColor;
    this.submitChanges();
  }

  submitChanges() {
    this.statsService.updateStats(this.id, this.stats, this.token).subscribe({
      next: data => {

        this.statsService.getStatsById(this.playerUser.id, this.token).subscribe({
          next: data => {
            if (this.playerUser.id == this.id) {
              this.statsUser = data
              this.playerUser.stats = this.statsUser;
              this.localStorage.set("player", JSON.stringify(this.playerUser));
            }
            //this.router.navigate(['/players']);
            console.log(data);
          },
          error: error => console.log(error)
        })

      },
      error: error => {
        alert("Can't update stats!");
        this.router.navigate(['/players']);
        console.log(error);
      }
    })
  }
}
