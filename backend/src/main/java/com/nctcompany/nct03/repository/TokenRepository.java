package com.nctcompany.nct03.repository;

import com.nctcompany.nct03.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findByUserId(Long userId);

    Optional<Token> findByToken(String token);

    Optional<Token> findByRefreshToken(String refreshToken);
}
