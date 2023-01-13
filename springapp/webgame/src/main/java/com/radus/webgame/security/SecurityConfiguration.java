package com.radus.webgame.security;

import com.radus.webgame.player.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .authorizeHttpRequests()
                .requestMatchers(HttpMethod.OPTIONS)
                .permitAll()

                .requestMatchers("/api/enemies")
                .hasAnyAuthority(Role.ADMIN.name(), Role.PLAYER.name())

                .requestMatchers("/api/stats/{playerId}")
                .hasAnyAuthority(Role.ADMIN.name(), Role.PLAYER.name())

                .requestMatchers("/api/em/{email}")
                .hasAnyAuthority(Role.ADMIN.name(), Role.PLAYER.name())

                .requestMatchers(HttpMethod.GET,"/api/player")
                .hasAnyAuthority(Role.ADMIN.name(), Role.PLAYER.name())

                .requestMatchers(HttpMethod.POST,"/api/player")
                .hasAuthority(Role.ADMIN.name())

                .requestMatchers("/api/player/{playerId}")
                .hasAnyAuthority(Role.ADMIN.name(), Role.PLAYER.name())

                .requestMatchers("/api/auth/**")
                .permitAll()

                .anyRequest()
                .authenticated()

                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}