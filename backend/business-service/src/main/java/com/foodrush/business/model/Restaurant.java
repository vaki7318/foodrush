package com.foodrush.business.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "restaurants")
@Data
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    private String adresse;
    private String telephone;
    private String photo;
    private String categorie;
    
    @Column(name = "proprietaire_id")
    private String proprietaireId;
}
