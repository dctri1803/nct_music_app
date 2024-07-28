package com.nctcompany.nct03.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpdateUserRequest {

    @Size(min = 3, max = 128, message = "Username must be at least 3 characters and not exceed 128 characters")
    private String name;

    private MultipartFile photoFile;
}
