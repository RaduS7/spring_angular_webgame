package com.radus.webgame.enemy.service;

import com.radus.webgame.enemy.model.EnemyStats;
import com.radus.webgame.enemy.repository.EnemyStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnemyStatsService {
    private final EnemyStatsRepository enemyStatsRepository;

    @Autowired
    public EnemyStatsService(EnemyStatsRepository enemyStatsRepository) {
        this.enemyStatsRepository = enemyStatsRepository;
    }

    public List<EnemyStats> getAllEnemyStats() {
        return enemyStatsRepository.findAll();
    }
}
