package com.nctcompany.nct03.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "User name is required")
    @Size(min = 3, max = 128, message = "Username must be at least 3 characters and not exceed 128 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Size(max = 128, message = "Email cannot exceed 128 characters")
    @Email(message = "Email is not valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be at least 8 characters and cannot exceed 128 characters")
    private String password;

}
