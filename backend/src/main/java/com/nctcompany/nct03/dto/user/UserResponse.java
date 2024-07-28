package com.nctcompany.nct03.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String photo;
    private String email;
    private String role;
}
