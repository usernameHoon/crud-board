package com.sideproject.board.security;

import com.sideproject.board.service.JwtService;
import com.sideproject.board.service.CustomUserDetailsService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.RequiredArgsConstructor;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final CustomUserDetailsService userDetailsService;

  private static final Logger logger = Logger.getLogger(JwtAuthenticationFilter.class.getName());

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String token = getJwtFromRequest(request);

    try {
      if (token != null && jwtService.validateToken(token)) {
        String email = jwtService.extractEmail(token);
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
          UserDetails userDetails = userDetailsService.loadUserByUsername(email);
          Authentication authentication = jwtService.getAuthentication(token, userDetails);
          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      }
    } catch (ExpiredJwtException e) {
      logger.warning("JWT expired: " + e.getMessage());
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
      return;
    } catch (JwtException e) {
      logger.warning("Invalid JWT: " + e.getMessage());
      response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
      return;
    }

    chain.doFilter(request, response);
  }

  private String getJwtFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
    return (bearerToken != null && bearerToken.startsWith("Bearer ")) ? bearerToken.substring(7) : null;
  }
}
