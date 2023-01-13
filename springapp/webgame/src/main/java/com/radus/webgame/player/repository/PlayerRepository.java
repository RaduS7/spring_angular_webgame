package com.radus.webgame.player.repository;

import com.radus.webgame.player.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    @Query
    Optional<Player> findPlayerByEmail(String email);
    @Query("SELECT p FROM Player p ORDER BY p.score DESC")
    Optional<List<Player>> findPlayersOrderedByScore();
}
