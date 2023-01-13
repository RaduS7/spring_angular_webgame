package com.radus.webgame.enemy.repository;

import com.radus.webgame.enemy.model.EnemyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnemyStatsRepository extends JpaRepository<EnemyStats, Long> {

}
