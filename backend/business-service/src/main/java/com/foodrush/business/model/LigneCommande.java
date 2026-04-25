package com.foodrush.business.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id")
    @JsonIgnore
    private Commande commande;

    @Column(name = "plat_id")
    private Long platId;

    @Column(name = "nom_plat")
    private String nomPlat;

    private Integer quantite;

    @Column(name = "prix_unitaire")
    private BigDecimal prixUnitaire;
}
