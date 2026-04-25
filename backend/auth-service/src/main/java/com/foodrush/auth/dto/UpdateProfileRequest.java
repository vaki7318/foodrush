package com.foodrush.auth.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nom;
    private String email;
    private String telephone;
}
