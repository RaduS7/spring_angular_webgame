import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as p5 from 'p5';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/player.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { Player } from 'src/app/player';
import { StatsService } from 'src/app/stats.service';
import { EnemyStats } from 'src/app/enemy-stats';
import { EnemyService } from 'src/app/enemy.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  sk: boolean;
  skRef: p5 | null;
  playerUser: Player;
  enemies: EnemyStats[];
  token: string | null;

  @ViewChild("gameDiv") gameDiv: ElementRef;

  constructor(private playerService: PlayerService,
    private router: Router,
    private localStorage: LocalStorageService,
    private statsService: StatsService,
    private enemyService: EnemyService) {

  }

  ngOnInit() {
    this.sk = false;
    this.token = this.localStorage.get("token");

    let obj: any = this.localStorage.get("player");
    if (obj != null) {
      this.playerUser = JSON.parse(obj);
      console.log(this.playerUser);

      this.enemyService.getEnemyStats(this.token).subscribe({
        next: data => {
          this.enemies = data;

          console.log(this.enemies);
        },
        error: error => console.log(error)
      });
    }
    else {
      alert("YOU ARE NOT LOGGED IN!");
      this.router.navigate(['/user-login-create']);
    }
  }

  onClick() {

    if (this.sk == false) {
      this.sk = true;

      let p = new p5(() => { }, this.gameDiv.nativeElement);

      this.skRef = p;
      //-----------------------------------------------------------------


      let map: p5.Color[][];
      let mapColors: string[][];
      let noiseScale = 1 / 150;
      let ocean = "#008dc4";
      let shore = "#00a9cc";
      let sand = "#eecda3";
      let grass = "#7ec850";
      let stone = "#676767";
      let snow = "#fffafa";

      let pg: p5.Graphics;

      let player: Player;
      let enemyList: Enemy[] = [];
      let deadEnemiesList: Enemy[] = [];

      class GameController {
        static playerName = "";

        static canvasX = window.innerWidth - 50;
        static canvasY = window.innerHeight - 115;

        static gameEnded = false;

        static playerOrigColor = 'blue';
        static playerOrigHp = 100;

        // static enemySize = 100;
        // static enemyColor = "black";
        // static enemyHP = 25;
        // static enemySpeed = 0.01;
        // static enemyAttack = 0.5;

        static enemySpawnTimer = 3;
        static deadEnemyTimer = 2;
        static healingTimer = 2;
        static lifeOrbTimer = 10;
        static rechargeLifeTimer = 0;
        static playerScore = 0;

        static drawEnemies(enemyList: Enemy[]) {
          enemyList.forEach((enemy) => {
            enemy.drawEnemy();
          });
        }

        static drawPlayerStats() {
          p.textSize(40);
          p.fill(0, 102, 153);
          p.text("Score: " + GameController.playerScore, 25, 50);
        }

        static spawnRandomEnemies(enemies: EnemyStats[]) {
          let randEnemy = Math.floor(p.random(0, 3));
          enemyList.push(new Enemy(p.random(100, GameController.canvasX - 50), p.random(100, GameController.canvasY - 50), enemies[randEnemy].enemySize, enemies[randEnemy].enemyColor, enemies[randEnemy].enemyHp, enemies[randEnemy].enemySpeed * p.random(0.5, 1.5), enemies[randEnemy].enemyAttack));
        }
      }

      class Circle {
        x: number;
        y: number;
        size: number;
        color: string;

        constructor(x: number, y: number, size: number, color: string) {
          this.x = x;
          this.y = y;
          this.size = size;
          this.color = color;
        }

        printPosition() {
          console.log("x: " + this.x + " | y: " + this.y);
        }

        getPVM() {
          return p.sqrt(this.x * this.x + this.y * this.y);
        }

        getDistance(object: Circle) {
          return p.sqrt((this.x - object.x) * (this.x - object.x) + (this.y - object.y) * (this.y - object.y));
        }

        getRadius() {
          return this.size / 2;
        }

        collidesWith(object: Circle) {
          if (this.getRadius() + object.getRadius() > this.getDistance(object))
            return true;

          return false;
        }
      }

      class LifeOrb extends Circle {
        constructor(x: number, y: number, size: number, color: string) {
          super(x, y, size, color);
        }

        drawOrb() {
          p.fill(p.color(this.color));
          p.circle(this.x, this.y, this.size);
          p.fill("red");
          p.text("HP", this.x - this.getRadius() - 10, this.y - this.getRadius() - 5);
          p.fill(255);
        }

        healPlayerOnCollision(object: Player) {
          if (this.collidesWith(object)) {
            object.hp += 20;
            return true;
          }
          return false;
        }
      }

      class Entity extends Circle {
        hp: number;
        speed: number;
        attack: number;

        constructor(x: number, y: number, size: number, color: string, hp: number, speed: number, attack: number) {
          super(x, y, size, color);
          this.hp = hp;
          this.speed = speed;
          this.attack = attack;
        }

        receiveDamage(attacker: Entity) {
          if (this.hp > 0 && attacker.hp > 0 && this.collidesWith(attacker)) {
            //this.color = color(random(150, 255));
            this.x = this.x + p.random(-2, 2);
            this.y = this.y + p.random(-2, 2);

            if (this.hp >= 0) {
              this.hp -= attacker.attack;
            }
          }
        }
      }

      class Player extends Entity {
        constructor(x: number, y: number, size: number, color: string, hp: number, speed: number, attack: number) {
          super(x, y, size, color, hp, speed, attack);
        }

        drawPlayer() {
          if (this.x != p.mouseX)
            this.x += (p.mouseX - this.x) * this.speed;

          if (this.y != p.mouseY)
            this.y += (p.mouseY - this.y) * this.speed;

          if (this.hp > 0) {
            p.fill(p.color(this.color));
            p.circle(this.x, this.y, this.size);
            p.textSize(32);
            p.fill(0, 102, 153);
            p.text(Math.round(this.hp * 100) / 100, this.x - this.getRadius() - 10, this.y - this.getRadius() - 5);
            p.fill(255);
          }
          else {
            this.size += 0.15;
            let deadCol = p.color("red");
            deadCol.setAlpha(0 + 128 * this.size / 1000);
            p.fill(deadCol);
            p.circle(this.x, this.y, this.size);
            p.textSize(32);
            p.fill(0, 102, 153);
            p.text("DEAD", this.x - this.getRadius() - 10, this.y - this.getRadius() - 5);
            p.fill(255);
          }
        }

        override receiveDamage(attacker: Entity) {
          super.receiveDamage(attacker)
          if (this.hp > 0 && attacker.hp > 0 && this.collidesWith(attacker))
            GameController.healingTimer = 2;
        }

        heal() {
          if (this.hp < GameController.playerOrigHp)
            this.hp += 0.075;
          else
            this.hp = GameController.playerOrigHp;
        }

        adjustSpeed(playerSpeed) {

          let xp = Math.round(this.x);
          let yp = Math.round(this.y);

          if (mapColors[xp] != undefined && mapColors[xp][yp] != undefined) {

            if (mapColors[xp][yp] === grass)
              this.speed = playerSpeed;
            else if (mapColors[xp][yp] === sand)
              this.speed = playerSpeed * 0.5;
            else if (mapColors[xp][yp] === stone)
              this.speed = playerSpeed * 0.3;
            else if (mapColors[xp][yp] === snow)
              this.speed = playerSpeed * 0.2;
            else if (mapColors[xp][yp] === ocean && mapColors[xp][yp] == shore)
              this.speed = playerSpeed * 0.05;

          }
        }
      }

      class Enemy extends Entity {
        constructor(x: number, y: number, size: number, color: string, hp: number, speed: number, attack: number) {
          super(x, y, size, color, hp, speed, attack);
        }

        drawEnemy() {
          if (this.hp > 0) {
            if (this.x != p.mouseX)
              this.x += (p.mouseX - this.x) * this.speed;

            if (this.y != p.mouseY)
              this.y += (p.mouseY - this.y) * this.speed;
          }

          if (this.hp > 0) {
            p.fill(p.color(this.color));
            p.circle(this.x, this.y, this.size);
            p.textSize(32);
            p.fill(0, 102, 153);
            p.text(Math.round(this.hp * 100) / 100, this.x - this.getRadius() - 10, this.y - this.getRadius() - 5);
            p.fill(255);
          }
          else {
            this.size += 0.15;
            let deadCol = p.color("red");
            deadCol.setAlpha(128 + 128 * this.size / 2000);
            p.fill(deadCol);
            p.circle(this.x, this.y, this.size);
            p.textSize(32);
            p.fill(0, 102, 153);
            p.text("DEAD", this.x - this.getRadius() - 10, this.y - this.getRadius() - 5);
            p.fill(255);
          }
        }
      }

      function makeMap() {
        map = [];
        mapColors = [];
        for (let i = 0; i < p.width; i++) {
          map[i] = [];
          mapColors[i] = [];
          for (let j = 0; j < p.height; j++) {
            let { col, colStr } = pickColor(i, j);
            map[i][j] = col;
            mapColors[i][j] = colStr;
          }
        }
      }

      function pickColor(i: number, j: number) {
        let h = p.noise((i) * noiseScale,
          (j) * noiseScale);
        let c = "#facade";

        if (h < 0.2)
          c = ocean;
        else if (h < 0.4)
          c = shore;
        else if (h < 0.5)
          c = sand;
        else if (h < 0.7)
          c = grass;
        else if (h < 0.9)
          c = stone;
        else
          c = snow;

        return {
          col: p.color(c),
          colStr: c
        };
      }

      function drawMap() {
        for (let i = 0; i < p.width; i++) {
          for (let j = 0; j < p.height; j++) {
            pg.set(i, j, map[i][j])
          }
        }
        pg.updatePixels();
      }

      let once = true;

      // p.setup = () => {
      //   p.createCanvas(GameController.canvasX, GameController.canvasY);
      //   p.textFont('Georgia');

      //   player = new Player(10, 10, this.playerUser.stats.playerSize, this.playerUser.stats.playerColor, this.playerUser.stats.playerHp, this.playerUser.stats.playerSpeed, this.playerUser.stats.playerAttack);

      //   p.noStroke();

      //   pg = p.createGraphics(GameController.canvasX, GameController.canvasY);

      //   pg.noStroke();

      //   pg.background(0);

      //   pg.noiseDetail(5, 0.5);

      //   makeMap();

      //   drawMap();
      // }

      let lifeOrb: LifeOrb = null;

      p.draw = () => {
        if (once) {
          once = false;

          GameController.playerOrigColor = this.playerUser.stats.playerColor;
          GameController.playerOrigHp = this.playerUser.stats.playerHp;

          p.createCanvas(GameController.canvasX, GameController.canvasY);
          p.textFont('Georgia');

          player = new Player(10, 10, this.playerUser.stats.playerSize, this.playerUser.stats.playerColor, this.playerUser.stats.playerHp, this.playerUser.stats.playerSpeed, this.playerUser.stats.playerAttack);

          p.noStroke();

          pg = p.createGraphics(GameController.canvasX, GameController.canvasY);

          pg.noStroke();

          pg.background(0);

          pg.noiseDetail(5, 0.5);

          makeMap();

          drawMap();
        }

        if (player.hp > 0) {

          p.image(pg, 0, 0);

          GameController.drawPlayerStats();

          player.drawPlayer();
          player.adjustSpeed(this.playerUser.stats.playerSpeed);

          GameController.drawEnemies(enemyList);
          GameController.drawEnemies(deadEnemiesList);

          if (lifeOrb != null) {
            lifeOrb.drawOrb();
            if (lifeOrb.healPlayerOnCollision(player)) {
              lifeOrb = null;
            }
          }

          //Enemies receive damage from the player
          for (let i = 0; i < enemyList.length; i++) {
            enemyList[i].receiveDamage(player);
            player.receiveDamage(enemyList[i]);

            if (enemyList[i].hp <= 0) {
              deadEnemiesList.push(enemyList.splice(i, 1)[0]);
              GameController.playerScore++;
            }

          }

          /// ------------ TIMERS --------------

          //healingTimer for healing the player    
          if (p.frameCount % 60 == 0 && GameController.healingTimer > 0)
            GameController.healingTimer--;
          if (GameController.healingTimer == 0) {
            player.heal();
            player.color = GameController.playerOrigColor;
          }

          //deadEnemyTimer for deleting dead enemies
          if (p.frameCount % 60 == 0 && GameController.deadEnemyTimer > 0)
            GameController.deadEnemyTimer--;
          if (GameController.deadEnemyTimer == 0 && deadEnemiesList.length > 0)
            deadEnemiesList.pop();
          if (deadEnemiesList.length == 0)
            GameController.deadEnemyTimer = 2;

          if (p.frameCount % 60 == 0 && GameController.enemySpawnTimer > 0)
            GameController.enemySpawnTimer--;
          if (GameController.enemySpawnTimer == 0) {
            GameController.spawnRandomEnemies(this.enemies);
            GameController.enemySpawnTimer = 3;
          }

          if (p.frameCount % 60 == 0 && GameController.lifeOrbTimer > 0)
            GameController.lifeOrbTimer--;
          if (GameController.lifeOrbTimer == 0) {
            lifeOrb = new LifeOrb(p.random(100, GameController.canvasX - 50), p.random(100, GameController.canvasY - 50), 40, "purple");
            GameController.lifeOrbTimer = Math.floor(p.random(3, 5) * 10);
          }
        }
        else if (GameController.gameEnded == false) {

          console.log(this.playerUser);

          this.playerUser.score = Math.max(GameController.playerScore, this.playerUser.score);
          this.localStorage.set("player", JSON.stringify(this.playerUser));

          let updatePlayer = {
            name: this.playerUser.name,
            email: this.playerUser.email,
            score: this.playerUser.score,
            id: this.playerUser.id,
            role: this.playerUser.role,
            stats: this.playerUser.stats
          }

          this.playerService.updatePlayer(updatePlayer.id, updatePlayer, this.token).subscribe({
            next: data => {
              console.log(data);
            },
            error: error => {
              alert("NOT LOGGED IN!");
              console.log(error);
            }
          });

          let statsObj = updatePlayer.stats;
          statsObj.playerMoney += GameController.playerScore * 5;

          this.statsService.updateStats(updatePlayer.id, statsObj, this.token).subscribe({
            next: data => {
              console.log(data);
            },
            error: error => {
              alert("NOT LOGGED IN!");
              console.log(error);
            }
          });

          GameController.gameEnded = true;
          this.sk = false;
        }
        else {
          p.background(255);
          p.fill(0, 102, 153);
          p.textSize(100);
          p.text("DEAD", GameController.canvasX / 2 - 200, GameController.canvasY / 2);
          p.text("SCORE: ", GameController.canvasX / 2 - 200, GameController.canvasY / 2 + 100);
          p.text(GameController.playerScore, GameController.canvasX / 2 - 200, GameController.canvasY / 2 + 200);

          if (p.frameCount % 240 == 0) {
            p.remove();
            window.location.reload();
          }
        }
      }

      //-----------------------------------------------------------------

    }
    else {
      this.sk = false;
      this.skRef.remove();
      window.location.reload();
    }
  }

  // sketch(p: p5) {

  // }
}