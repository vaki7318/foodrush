package com.foodrush.business.service;

import com.foodrush.business.dto.RestaurantDTO;
import com.foodrush.business.model.Restaurant;
import com.foodrush.business.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {
    private final RestaurantRepository repo;
    public RestaurantService(RestaurantRepository repo) { this.repo = repo; }

    public List<RestaurantDTO> getAll() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public RestaurantDTO getById(Long id) {
        return repo.findById(id).map(this::toDTO).orElse(null);
    }

    public List<RestaurantDTO> getByProprietaire(String id) {
        return repo.findByProprietaireId(id).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<RestaurantDTO> getByCategorie(String cat) {
        return repo.findByCategorie(cat).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public RestaurantDTO create(RestaurantDTO dto) {
        return toDTO(repo.save(fromDTO(dto)));
    }

    public RestaurantDTO update(Long id, RestaurantDTO dto) {
        if (repo.findById(id).isEmpty()) return null;
        Restaurant r = fromDTO(dto);
        r.setId(id);
        return toDTO(repo.save(r));
    }

    public void delete(Long id) { repo.deleteById(id); }

    private RestaurantDTO toDTO(Restaurant r) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(r.getId());
        dto.setNom(r.getNom());
        dto.setDescription(r.getDescription());
        dto.setAdresse(r.getAdresse());
        dto.setTelephone(r.getTelephone());
        dto.setPhoto(r.getPhoto());
        dto.setCategorie(r.getCategorie());
        dto.setProprietaireId(r.getProprietaireId());
        return dto;
    }

    private Restaurant fromDTO(RestaurantDTO dto) {
        Restaurant r = new Restaurant();
        r.setNom(dto.getNom());
        r.setDescription(dto.getDescription());
        r.setAdresse(dto.getAdresse());
        r.setTelephone(dto.getTelephone());
        r.setPhoto(dto.getPhoto());
        r.setCategorie(dto.getCategorie());
        r.setProprietaireId(dto.getProprietaireId());
        return r;
    }
}
