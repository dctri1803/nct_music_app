package com.nctcompany.nct03.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    @Size(min = 8, max = 128, message = "Current password must be at least 8 characters and cannot exceed 128 characters")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 128, message = "New password must be at least 8 characters and cannot exceed 128 characters")
    private String newPassword;

    @NotBlank(message = "Confirmation password is required")
    @Size(min = 8, max = 128, message = "Confirmation password must be at least 8 characters and cannot exceed 128 characters")
    private String confirmationPassword;
}
