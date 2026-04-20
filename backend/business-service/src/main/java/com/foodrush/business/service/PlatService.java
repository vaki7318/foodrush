package com.foodrush.business.service;

import com.foodrush.business.model.Plat;
import com.foodrush.business.repository.PlatRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlatService {
    private final PlatRepository repo;
    public PlatService(PlatRepository repo) { this.repo = repo; }
    public List<Plat> getByRestaurant(Long id) { return repo.findByRestaurantId(id); }
    public Plat getById(Long id) { return repo.findById(id).orElse(null); }
    public Plat create(Plat p) { return repo.save(p); }
    public Plat update(Long id, Plat p) {
        Plat existing = getById(id);
        if (existing == null) return null;
        p.setId(id);
        return repo.save(p);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
