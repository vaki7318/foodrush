package com.foodrush.business.service;

import com.foodrush.business.model.Restaurant;
import com.foodrush.business.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RestaurantService {
    private final RestaurantRepository repo;
    public RestaurantService(RestaurantRepository repo) { this.repo = repo; }
    public List<Restaurant> getAll() { return repo.findAll(); }
    public Restaurant getById(Long id) { return repo.findById(id).orElse(null); }
    public List<Restaurant> getByProprietaire(String id) { return repo.findByProprietaireId(id); }
    public List<Restaurant> getByCategorie(String cat) { return repo.findByCategorie(cat); }
    public Restaurant create(Restaurant r) { return repo.save(r); }
    public Restaurant update(Long id, Restaurant r) {
        Restaurant existing = getById(id);
        if (existing == null) return null;
        r.setId(id);
        return repo.save(r);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
