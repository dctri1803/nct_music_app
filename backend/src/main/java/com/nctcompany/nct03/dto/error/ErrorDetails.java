package com.nctcompany.nct03.dto.error;

import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Setter
@Getter
public class ErrorDetails {

    private Date timestamp;
    private int status;
    private String path;
    private List<String> errors = new ArrayList<>();

    public void addError(String message){
        this.errors.add(message);
    }
}