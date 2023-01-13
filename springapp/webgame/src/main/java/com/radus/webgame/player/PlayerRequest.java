package com.radus.webgame.player;

import com.radus.webgame.player.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlayerRequest {
    private String name;
    private String email;
    private int score;
    private String password;
    private Role role;
}
