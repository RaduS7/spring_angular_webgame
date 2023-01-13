package com.radus.webgame.player.service;

import com.radus.webgame.player.PlayerRequest;
import com.radus.webgame.player.model.Player;
import com.radus.webgame.player.model.PlayerStats;
import com.radus.webgame.player.model.Role;
import com.radus.webgame.player.repository.PlayerRepository;
import com.radus.webgame.player.repository.PlayerStatsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final PlayerStatsRepository playerStatsRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository, PlayerStatsRepository playerStatsRepository) {
        this.playerRepository = playerRepository; this.playerStatsRepository = playerStatsRepository;
    }

    public List<Player> getPlayers(){
        //return playerRepository.findAll();
        Optional<List<Player>> optionalPlayers = playerRepository.findPlayersOrderedByScore();

        if(optionalPlayers.isEmpty()) {
            throw new IllegalStateException("Users don't exist");
        }

        return  optionalPlayers.get();
    }

    public Player getPlayerByEmail(String email) {
        Optional<Player> playerOptional = playerRepository.findPlayerByEmail(email);

        if(playerOptional.isEmpty()) {
            throw new IllegalStateException("User doesn't exist");
        }

        return playerOptional.get();
    }

    public Player getPlayerById(Long id){
        Optional<Player> playerOptional = playerRepository.findById(id);

        if(playerOptional.isEmpty()) {
            throw new IllegalStateException("User doesn't exist");
        }

        return playerOptional.get();
    }

    public void addNewPlayer(PlayerRequest playerRequest) {
        Optional<Player> playerOptional = playerRepository.findPlayerByEmail(playerRequest.getEmail());

        if(playerOptional.isPresent()) {
            throw new IllegalStateException("Email taken!");
        }

        System.out.println(playerRequest.toString());

        var player = Player.builder()
                .name(playerRequest.getName())
                .email(playerRequest.getEmail())
                .password(new BCryptPasswordEncoder().encode(playerRequest.getPassword()))
                .role(Role.PLAYER)
                .score(playerRequest.getScore())
                .stats(new PlayerStats())
                .build();

        playerRepository.save(player);
    }

    public void deletePlayer(Long playerId) {
        boolean exists = playerRepository.existsById(playerId);

        if(!exists) {
            throw new IllegalStateException("" +
                    "Player with id " + playerId + " does not exist!");
        }

        playerStatsRepository.deleteById(playerRepository.findById(playerId).get().getStats().getId());
        playerRepository.deleteById(playerId);
    }

    @Transactional
    public void updatePlayer(Long playerId,
                             String name,
                             String email,
                             int score) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new IllegalStateException(
                "player with id " + playerId + " does not exist!"
        ));

        player.setScore(score);

        if(name != null &&
                name.length() > 0
//              && !Objects.equals(player.getName(), name)) {
        ) {
            player.setName(name);
        }

        if(email != null &&
                email.length() > 0
//                && !Objects.equals(player.getEmail(), name)) {
        ) {
            Optional<Player> playerOptional = playerRepository
                    .findPlayerByEmail(email);

            if(playerOptional.isPresent()) {
                if(!playerOptional.get().equals(player)) {
                    throw new IllegalStateException("Email taken!");
                }
            }

            player.setEmail(email);
        }
    }
}
