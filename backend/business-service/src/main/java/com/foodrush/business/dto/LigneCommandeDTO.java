package com.foodrush.business.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LigneCommandeDTO {
    private Long id;
    private Long platId;
    private String nomPlat;
    private Integer quantite;
    private BigDecimal prixUnitaire;
}
