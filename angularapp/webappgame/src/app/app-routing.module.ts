import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GameComponent } from "./components/game/game.component";
import { CreatePlayerComponent } from "./components/create-player/create-player.component";
import { PlayerListComponent } from "./components/player-list/player-list.component";
import { UpdatePlayerComponent } from "./components/update-player/update-player.component";
import { UserLoginComponent } from "./components/user-login/user-login.component";
import { UpdateStatsComponent } from "./components/update-stats/update-stats.component";

const routes: Routes = [
    {
        path: "user-login-create", component: UserLoginComponent
    },
    {
        path: "players", component: PlayerListComponent
    },
    {
        path: "game", component: GameComponent
    },
    {
        path: "create-player", component: CreatePlayerComponent
    },
    {
        path: "update-player/:id", component: UpdatePlayerComponent
    },
    {
        path: "update-stats/:id", component: UpdateStatsComponent
    },
    {
        path: "", redirectTo: "user-login-create", pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}