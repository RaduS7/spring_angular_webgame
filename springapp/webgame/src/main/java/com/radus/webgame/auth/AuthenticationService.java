package com.radus.webgame.auth;

import com.radus.webgame.player.model.Player;
import com.radus.webgame.player.model.PlayerStats;
import com.radus.webgame.player.repository.PlayerRepository;
import com.radus.webgame.player.model.Role;
import com.radus.webgame.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final PlayerRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var player = Player.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PLAYER)
                .stats(new PlayerStats())
                .build();

        repository.save(player);

        var jwtToken = jwtService.generateToken(player);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var player = repository.findPlayerByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(player);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
