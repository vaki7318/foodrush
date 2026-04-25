package com.foodrush.business.service;

import com.foodrush.business.model.Commande;
import com.foodrush.business.repository.CommandeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommandeService {
    private final CommandeRepository repo;
    public CommandeService(CommandeRepository repo) { this.repo = repo; }
    public List<Commande> getByClient(String id) { return repo.findByClientId(id); }
    public List<Commande> getByRestaurant(Long id) { return repo.findByRestaurantId(id); }
    public Commande create(Commande c) {
        if (c.getLignes() != null) {
            c.getLignes().forEach(l -> l.setCommande(c));
        }
        return repo.save(c);
    }
    public Commande updateStatut(Long id, String statut) {
        Commande c = repo.findById(id).orElse(null);
        if (c == null) return null;
        c.setStatut(statut);
        return repo.save(c);
    }
}
