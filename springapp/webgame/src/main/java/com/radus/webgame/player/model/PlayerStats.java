package com.radus.webgame.player.model;

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
public class PlayerStats {
    @Id
    @SequenceGenerator(
            name = "player_stats_sequence",
            sequenceName = "player_stats_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "player_stats_sequence"
    )
    private Long id;

    @Column(columnDefinition = "integer default 25")
    int playerSize = 60;

    @Column(columnDefinition = "varchar(20) default 'blue'")
    String playerColor = "blue";

    @Column(columnDefinition = "integer default 100")
    int playerHp = 100;

    @Column(columnDefinition = "double precision default 0.05")
    double playerSpeed = 0.05;

    @Column(columnDefinition = "double precision default 0.5")
    double playerAttack = 0.5;

    @Column(columnDefinition = "integer default 100")
    int playerMoney = 0;
}
