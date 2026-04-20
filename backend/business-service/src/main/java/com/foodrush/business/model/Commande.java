package com.foodrush.business.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "commandes")
@Data
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "client_id")
    private String clientId;
    
    @Column(name = "restaurant_id")
    private Long restaurantId;
    
    private String statut = "en_attente";
    
    @Column(name = "date_commande")
    private String dateCommande;
    
    @Column(name = "adresse_livraison")
    private String adresseLivraison;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "commande_id")
    private List<LigneCommande> lignes;
}
