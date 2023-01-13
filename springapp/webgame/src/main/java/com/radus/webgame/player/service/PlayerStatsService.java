package com.radus.webgame.player.service;

import com.radus.webgame.player.model.Player;
import com.radus.webgame.player.model.PlayerStats;
import com.radus.webgame.player.repository.PlayerRepository;
import com.radus.webgame.player.repository.PlayerStatsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlayerStatsService {
    private final PlayerStatsRepository playerStatsRepository;

    @Autowired
    public PlayerStatsService(PlayerStatsRepository playerStatsRepository) {
        this.playerStatsRepository = playerStatsRepository;
    }

    public PlayerStats getPlayerStatsById(Long id){
        Optional<PlayerStats> playerOptional = playerStatsRepository.findById(id);

        if(playerOptional.isEmpty()) {
            throw new IllegalStateException("User doesn't exist");
        }

        return playerOptional.get();
    }

    @Transactional
    public void updatePlayerStats(Long playerId,
                                  int playerSize,
                                  int playerHp,
                                  String playerColor,
                                  double playerAttack,
                                  double playerSpeed,
                                  int playerMoney) {

        PlayerStats playerStats = playerStatsRepository.findById(playerId).orElseThrow(() -> new IllegalStateException(
                "player with id " + playerId + " does not exist!"
        ));

        playerStats.setPlayerSize(playerSize);
        playerStats.setPlayerColor(playerColor);
        playerStats.setPlayerHp(playerHp);
        playerStats.setPlayerSpeed(playerSpeed);
        playerStats.setPlayerAttack(playerAttack);
        playerStats.setPlayerMoney(playerMoney);
    }
}
