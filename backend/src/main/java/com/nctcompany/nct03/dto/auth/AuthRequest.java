package com.nctcompany.nct03.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {

    @NotBlank(message = "Email is required")
    @Size(max = 128, message = "Email cannot exceed 128 characters")
    @Email(message = "Email is not valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 128, message = "Password cannot exceed 128 characters")
    private String password;
}
