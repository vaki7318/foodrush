package com.foodrush.business.dto;

import lombok.Data;

@Data
public class RestaurantDTO {
    private Long id;
    private String nom;
    private String description;
    private String adresse;
    private String telephone;
    private String photo;
    private String categorie;
    private String proprietaireId;
}
