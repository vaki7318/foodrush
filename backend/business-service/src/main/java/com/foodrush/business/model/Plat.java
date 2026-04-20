package com.foodrush.business.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "plats")
@Data
public class Plat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    private BigDecimal prix;
    private String photo;
    private String categorie;
    
    @Column(name = "restaurant_id")
    private Long restaurantId;
    
    private Boolean disponible = true;
}
