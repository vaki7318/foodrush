package com.foodrush.business.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PlatDTO {
    private Long id;
    private String nom;
    private String description;
    private BigDecimal prix;
    private String photo;
    private String categorie;
    private Long restaurantId;
    private Boolean disponible;
}
