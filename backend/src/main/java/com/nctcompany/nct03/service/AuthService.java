package com.nctcompany.nct03.service;

import com.nctcompany.nct03.dto.auth.AuthRequest;
import com.nctcompany.nct03.dto.auth.AuthResponse;
import com.nctcompany.nct03.dto.auth.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AuthService {

    AuthResponse register(RegisterRequest request);
    AuthResponse authenticate(AuthRequest request);
    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
}
