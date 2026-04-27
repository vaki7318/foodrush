package com.foodrush.business.dto;

import lombok.Data;
import java.util.List;

@Data
public class CommandeDTO {
    private Long id;
    private String clientId;
    private Long restaurantId;
    private String statut;
    private String dateCommande;
    private String adresseLivraison;
    private List<LigneCommandeDTO> lignes;
}
