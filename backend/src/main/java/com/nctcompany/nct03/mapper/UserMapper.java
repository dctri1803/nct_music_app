package com.nctcompany.nct03.mapper;

import com.nctcompany.nct03.constant.ApplicationConstants;
import com.nctcompany.nct03.dto.user.UserResponse;
import com.nctcompany.nct03.model.User;

public class UserMapper {

    public static UserResponse mapToResponse(User user){
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();
        String photoName = user.getPhoto() != null ? user.getPhoto() : ApplicationConstants.DEFAULT_IMAGE;
        String photo = ApplicationConstants.APP_URL + "/users/images/" + photoName;
        userResponse.setPhoto(photo);
        return userResponse;
    }
}
