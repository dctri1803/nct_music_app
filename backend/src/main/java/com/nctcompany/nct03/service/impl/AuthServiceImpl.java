package com.nctcompany.nct03.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.constant.SecurityConstants;
import com.nctcompany.nct03.dto.auth.AuthRequest;
import com.nctcompany.nct03.dto.auth.AuthResponse;
import com.nctcompany.nct03.dto.auth.RegisterRequest;
import com.nctcompany.nct03.exception.DuplicateResourceException;
import com.nctcompany.nct03.exception.ResourceNotFoundException;
import com.nctcompany.nct03.model.Role;
import com.nctcompany.nct03.model.Token;
import com.nctcompany.nct03.model.TokenType;
import com.nctcompany.nct03.model.User;
import com.nctcompany.nct03.repository.RoleRepository;
import com.nctcompany.nct03.repository.TokenRepository;
import com.nctcompany.nct03.repository.UserRepository;
import com.nctcompany.nct03.security.JwtService;
import com.nctcompany.nct03.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;

    @Transactional
    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail();
        if (userRepository.existsByEmail(email)){
            throw new DuplicateResourceException("User with email=[%s] already existed".formatted(email));
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoto(ApplicationConstants.DEFAULT_IMAGE);

        Role role = roleRepository.findByName(Role.ROLE_FREE_USER);
        user.setRole(role);
        User savedUser = userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken, refreshToken);
        return new AuthResponse(jwtToken, SecurityConstants.JWT_TYPE, refreshToken);

    }

    private void saveUserToken(User user, String jwtToken, String refreshToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expiredDate(jwtService.extractExpiration(jwtToken))
                .refreshToken(refreshToken)
                .refreshExpiredDate(jwtService.extractExpiration(refreshToken))
                .build();
        tokenRepository.save(token);
    }

    @Transactional
    @Override
    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        if (authentication.isAuthenticated()){
            User user = (User) authentication.getPrincipal();
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            revokeUserTokens(user);
            saveUserToken(user, jwtToken, refreshToken);
            return new AuthResponse(jwtToken, SecurityConstants.JWT_TYPE, refreshToken);
        }else {
            throw new UsernameNotFoundException("Email not found");
        }
    }

    private void revokeUserTokens(User user){
        var tokens = tokenRepository.findByUserId(user.getId());
        if (tokens.isEmpty())
            return;
        if (tokens.size() >= ApplicationConstants.MIN_TOKEN_SIZE){
            Token deleteToken = tokens.get(0);
            tokenRepository.deleteById(deleteToken.getId());
        }
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null){
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User with email=[%s] not found".formatted(userEmail)));
            if (jwtService.isTokenValid(refreshToken, user)){
                Token token = tokenRepository.findByRefreshToken(refreshToken)
                        .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));
                String accessToken = jwtService.generateToken(user);
                String newRefreshToken = jwtService.generateRefreshToken(user);
                tokenRepository.deleteById(token.getId());
                saveUserToken(user, accessToken, newRefreshToken);
                var authResponse = new AuthResponse(accessToken, SecurityConstants.JWT_TYPE, newRefreshToken);

                // Sử dụng ObjectMapper để chuyển đổi AuthResponse thành chuỗi JSON
                ObjectMapper objectMapper = new ObjectMapper();
                String jsonResponse = objectMapper.writeValueAsString(authResponse);

                // Thiết lập các header cho response
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");

                // Ghi chuỗi JSON vào OutputStream của HttpServletResponse
                response.getWriter().write(jsonResponse);
            }
        }
    }
}
