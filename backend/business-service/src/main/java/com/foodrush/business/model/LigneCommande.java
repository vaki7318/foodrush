package com.foodrush.business.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "ligne_commandes")
@Data
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "commande_id")
    private Long commandeId;
    
    @Column(name = "plat_id")
    private Long platId;
    
    @Column(name = "nom_plat")
    private String nomPlat;
    
    private Integer quantite;
    
    @Column(name = "prix_unitaire")
    private BigDecimal prixUnitaire;
}
