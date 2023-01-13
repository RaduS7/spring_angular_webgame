package com.radus.webgame.player.controller;

import com.radus.webgame.player.model.Player;
import com.radus.webgame.player.model.PlayerStats;
import com.radus.webgame.player.service.PlayerService;
import com.radus.webgame.player.service.PlayerStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class PlayerStatsController {
    private final PlayerStatsService playerStatsService;

    @Autowired
    public PlayerStatsController(PlayerStatsService playerStatsService) {
        this.playerStatsService = playerStatsService;
    }

    @CrossOrigin
    @GetMapping(path = "api/stats/{playerId}")
    public PlayerStats getPlayers(@PathVariable("playerId") Long playerId) {
        return playerStatsService.getPlayerStatsById(playerId);
    }

    @CrossOrigin
    @PutMapping(path = "api/stats/{playerId}")
    public void updatePlayerStats(@PathVariable("playerId") Long playerId,
                                  @RequestBody PlayerStats playerStats) {
        playerStatsService.updatePlayerStats(playerId,
                playerStats.getPlayerSize(), playerStats.getPlayerHp(),
                playerStats.getPlayerColor(), playerStats.getPlayerAttack(),
                playerStats.getPlayerSpeed(), playerStats.getPlayerMoney());
    }

//    @CrossOrigin
//    @PostMapping(path = "api/stats/{playerId}")
//    public void createPlayerStats(@PathVariable("playerId") Long playerId,
//                                  @RequestBody PlayerStats playerStats) {
//        playerStatsService.updatePlayerStats(playerId,
//                playerStats.getPlayerSize(), playerStats.getPlayerHp(),
//                playerStats.getPlayerColor(), playerStats.getPlayerAttack(),
//                playerStats.getPlayerSpeed(), playerStats.getPlayerMoney());
//    }
}
