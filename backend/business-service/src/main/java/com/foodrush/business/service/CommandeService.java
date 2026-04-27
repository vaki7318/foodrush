package com.foodrush.business.service;

import com.foodrush.business.dto.CommandeDTO;
import com.foodrush.business.dto.LigneCommandeDTO;
import com.foodrush.business.model.Commande;
import com.foodrush.business.model.LigneCommande;
import com.foodrush.business.repository.CommandeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommandeService {
    private final CommandeRepository repo;
    public CommandeService(CommandeRepository repo) { this.repo = repo; }

    public List<CommandeDTO> getByClient(String id) {
        return repo.findByClientId(id).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CommandeDTO> getByRestaurant(Long id) {
        return repo.findByRestaurantId(id).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CommandeDTO create(CommandeDTO dto) {
        Commande c = fromDTO(dto);
        if (c.getLignes() != null) {
            c.getLignes().forEach(l -> l.setCommande(c));
        }
        return toDTO(repo.save(c));
    }

    public CommandeDTO updateStatut(Long id, String statut) {
        Commande c = repo.findById(id).orElse(null);
        if (c == null) return null;
        c.setStatut(statut);
        return toDTO(repo.save(c));
    }

    private CommandeDTO toDTO(Commande c) {
        CommandeDTO dto = new CommandeDTO();
        dto.setId(c.getId());
        dto.setClientId(c.getClientId());
        dto.setRestaurantId(c.getRestaurantId());
        dto.setStatut(c.getStatut());
        dto.setDateCommande(c.getDateCommande());
        dto.setAdresseLivraison(c.getAdresseLivraison());
        if (c.getLignes() != null) {
            dto.setLignes(c.getLignes().stream().map(l -> {
                LigneCommandeDTO ldto = new LigneCommandeDTO();
                ldto.setId(l.getId());
                ldto.setPlatId(l.getPlatId());
                ldto.setNomPlat(l.getNomPlat());
                ldto.setQuantite(l.getQuantite());
                ldto.setPrixUnitaire(l.getPrixUnitaire());
                return ldto;
            }).collect(Collectors.toList()));
        }
        return dto;
    }

    private Commande fromDTO(CommandeDTO dto) {
        Commande c = new Commande();
        c.setClientId(dto.getClientId());
        c.setRestaurantId(dto.getRestaurantId());
        c.setStatut(dto.getStatut() != null ? dto.getStatut() : "en_attente");
        c.setDateCommande(dto.getDateCommande());
        c.setAdresseLivraison(dto.getAdresseLivraison());
        if (dto.getLignes() != null) {
            c.setLignes(dto.getLignes().stream().map(l -> {
                LigneCommande ligne = new LigneCommande();
                ligne.setPlatId(l.getPlatId());
                ligne.setNomPlat(l.getNomPlat());
                ligne.setQuantite(l.getQuantite());
                ligne.setPrixUnitaire(l.getPrixUnitaire());
                return ligne;
            }).collect(Collectors.toList()));
        }
        return c;
    }
}
