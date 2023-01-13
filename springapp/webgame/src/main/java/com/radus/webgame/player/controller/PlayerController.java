package com.radus.webgame.player.controller;

import com.radus.webgame.player.PlayerRequest;
import com.radus.webgame.player.model.PlayerStats;
import com.radus.webgame.player.service.PlayerService;
import com.radus.webgame.player.model.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
//@RequestMapping(path = "api/player")
@RequestMapping
public class PlayerController {
    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @CrossOrigin
    @GetMapping(path = "api/player")
    public List<Player> getPlayers() {
        return playerService.getPlayers();
    }

    @CrossOrigin
    @GetMapping(path="api/em/{email}")
    public Player getPlayerByEmail(@PathVariable("email") String email) {
        return playerService.getPlayerByEmail(email);
    }

    @CrossOrigin
    @GetMapping(path = "api/player/{playerId}")
    public Player getPlayerById(@PathVariable("playerId") Long playerId) {
        return playerService.getPlayerById(playerId);
    }

    @CrossOrigin
    @PostMapping(path = "api/player")
    public void registerNewPlayer(@RequestBody PlayerRequest player) {
        playerService.addNewPlayer(player);
    }

    @CrossOrigin
    @DeleteMapping(path = "api/player/{playerId}")
    public void deletePlayer(@PathVariable("playerId") Long playerId) {
        playerService.deletePlayer(playerId);
    }

    @CrossOrigin
    @PutMapping(path = "api/player/{playerId}")
    public void updatePlayer(
            @PathVariable("playerId") Long playerId,
            @RequestBody Player player) {

        playerService.updatePlayer(playerId, player.getName(), player.getEmail(), player.getScore());
    }
}
