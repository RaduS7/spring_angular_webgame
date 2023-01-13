package com.radus.webgame.initialization;

import com.radus.webgame.enemy.model.EnemyStats;
import com.radus.webgame.enemy.repository.EnemyStatsRepository;
import com.radus.webgame.player.model.Player;
import com.radus.webgame.player.repository.PlayerRepository;
import com.radus.webgame.player.model.Role;
import com.radus.webgame.player.model.PlayerStats;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Configuration
public class InitConfiguration {
    @Bean
    CommandLineRunner commandLineRunner(PlayerRepository playerRepository, EnemyStatsRepository enemyStatsRepository) {
        return args -> {
            if(!playerRepository.existsById(1L)) {
                PlayerStats playerStats = new PlayerStats();
                playerStats.setPlayerMoney(200);

                Player admin = new Player(
                        1L,
                        "Radu",
                        "radu.stefanescu@gmail.com",
                        new BCryptPasswordEncoder().encode("p123"),
                        0,
                        Role.ADMIN,
                        playerStats
                );

                playerRepository.save(admin);
            }

            if(!enemyStatsRepository.existsById(1L)) {
                EnemyStats enemyStats1 = new EnemyStats(
                        1L,
                        100,
                        "black",
                        25,
                        0.007,
                        0.5
                );

                enemyStatsRepository.save(enemyStats1);
            }

            if(!enemyStatsRepository.existsById(2L)) {
                EnemyStats enemyStats2 = new EnemyStats(
                        2L,
                        80,
                        "grey",
                        20,
                        0.01,
                        0.5
                );

                enemyStatsRepository.save(enemyStats2);
            }

            if(!enemyStatsRepository.existsById(3L)) {
                EnemyStats enemyStats3 = new EnemyStats(
                        3L,
                        60,
                        "white",
                        15,
                        0.008,
                        0.6
                );

                enemyStatsRepository.save(enemyStats3);
            }
        };
    }
}
