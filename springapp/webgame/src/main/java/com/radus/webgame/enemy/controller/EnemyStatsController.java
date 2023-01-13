package com.radus.webgame.enemy.controller;

import com.radus.webgame.enemy.model.EnemyStats;
import com.radus.webgame.enemy.service.EnemyStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
//@RequestMapping(path = "api/player")
@RequestMapping
public class EnemyStatsController {

    private final EnemyStatsService enemyStatsService;

    @Autowired
    public EnemyStatsController(EnemyStatsService enemyStatsService) {
        this.enemyStatsService = enemyStatsService;
    }

    @CrossOrigin
    @GetMapping(path = "api/enemies")
    public List<EnemyStats> getPlayers() {
        return enemyStatsService.getAllEnemyStats();
    }
}
