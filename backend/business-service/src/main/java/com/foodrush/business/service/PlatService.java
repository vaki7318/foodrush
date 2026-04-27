package com.foodrush.business.service;

import com.foodrush.business.dto.PlatDTO;
import com.foodrush.business.model.Plat;
import com.foodrush.business.repository.PlatRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlatService {
    private final PlatRepository repo;
    public PlatService(PlatRepository repo) { this.repo = repo; }

    public List<PlatDTO> getByRestaurant(Long id) {
        return repo.findByRestaurantId(id).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PlatDTO getById(Long id) {
        return repo.findById(id).map(this::toDTO).orElse(null);
    }

    public PlatDTO create(PlatDTO dto) {
        return toDTO(repo.save(fromDTO(dto)));
    }

    public PlatDTO update(Long id, PlatDTO dto) {
        if (repo.findById(id).isEmpty()) return null;
        Plat p = fromDTO(dto);
        p.setId(id);
        return toDTO(repo.save(p));
    }

    public void delete(Long id) { repo.deleteById(id); }

    private PlatDTO toDTO(Plat p) {
        PlatDTO dto = new PlatDTO();
        dto.setId(p.getId());
        dto.setNom(p.getNom());
        dto.setDescription(p.getDescription());
        dto.setPrix(p.getPrix());
        dto.setPhoto(p.getPhoto());
        dto.setCategorie(p.getCategorie());
        dto.setRestaurantId(p.getRestaurantId());
        dto.setDisponible(p.getDisponible());
        return dto;
    }

    private Plat fromDTO(PlatDTO dto) {
        Plat p = new Plat();
        p.setNom(dto.getNom());
        p.setDescription(dto.getDescription());
        p.setPrix(dto.getPrix());
        p.setPhoto(dto.getPhoto());
        p.setCategorie(dto.getCategorie());
        p.setRestaurantId(dto.getRestaurantId());
        p.setDisponible(dto.getDisponible() != null ? dto.getDisponible() : true);
        return p;
    }
}
