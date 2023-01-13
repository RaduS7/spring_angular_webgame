package com.radus.webgame.security;

import com.radus.webgame.player.model.Player;
import com.radus.webgame.player.model.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        if ((authHeader == null ||!authHeader.startsWith("Bearer "))) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            System.out.println(userDetails.getAuthorities());
            System.out.println(request.getRequestURI());
            //System.out.println(request.getRequestURI().substring(12));

            // DON'T LET PLAYERS ACCESS OTHER RESOURCES THAN THEIR OWN
            Player player = (Player)userDetails;
            if(player.getRole() == Role.PLAYER &&
                    (request.getRequestURI().startsWith("/api/player/")
                    || request.getRequestURI().startsWith("/api/stats/"))
            ){
                if(player.getId() != Integer.parseInt(request.getRequestURI()
                        .substring((request.getRequestURI().startsWith("/api/player/"))?12:11))){
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            //DON'T LET PLAYERS DELETE THEIR OWN ACCOUNT
            if(request.getMethod().equals("DELETE")
                    && player.getId() == Integer.parseInt(request.getRequestURI().substring(12))){
                filterChain.doFilter(request, response);
                return;
            }

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
