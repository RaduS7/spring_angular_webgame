package com.radus.webgame.enemy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class EnemyStats {
    @Id
    @SequenceGenerator(
            name = "enemy_stats_sequence",
            sequenceName = "enemy_stats_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "enemy_stats_sequence"
    )
    private Long id;

    @Column(columnDefinition = "integer default 25")
    int enemySize = 100;

    @Column(columnDefinition = "varchar(20) default 'blue'")
    String enemyColor = "black";

    @Column(columnDefinition = "integer default 100")
    int enemyHp = 25;

    @Column(columnDefinition = "double precision default 0.05")
    double enemySpeed = 0.007;

    @Column(columnDefinition = "double precision default 0.5")
    double enemyAttack = 0.5;
}
