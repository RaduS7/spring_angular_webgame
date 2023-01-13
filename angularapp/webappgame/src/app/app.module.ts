import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { GameComponent } from './components/game/game.component';
import { AppRoutingModule } from './app-routing.module';
import { CreatePlayerComponent } from './components/create-player/create-player.component';
import { FormsModule } from '@angular/forms';
import { TokenInterceptorService } from './token-interceptor.service';
import { UpdatePlayerComponent } from './components/update-player/update-player.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { UpdateStatsComponent } from './components/update-stats/update-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameComponent,
    PlayerListComponent,
    CreatePlayerComponent,
    UpdatePlayerComponent,
    UserLoginComponent,
    UpdateStatsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
