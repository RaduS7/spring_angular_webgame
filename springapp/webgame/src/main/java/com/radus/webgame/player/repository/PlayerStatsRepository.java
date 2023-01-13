package com.radus.webgame.player.repository;

import com.radus.webgame.player.model.Player;
import com.radus.webgame.player.model.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {

}
