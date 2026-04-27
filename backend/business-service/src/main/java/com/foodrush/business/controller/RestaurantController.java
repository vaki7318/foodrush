package com.foodrush.business.controller;

import com.foodrush.business.dto.RestaurantDTO;
import com.foodrush.business.service.RestaurantService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantService service;
    public RestaurantController(RestaurantService s) { this.service = s; }

    @GetMapping
    public List<RestaurantDTO> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public RestaurantDTO getById(@PathVariable Long id) { return service.getById(id); }

    @GetMapping("/categorie/{cat}")
    public List<RestaurantDTO> getByCat(@PathVariable String cat) { return service.getByCategorie(cat); }

    @GetMapping("/proprietaire/{id}")
    public List<RestaurantDTO> getByProp(@PathVariable String id) { return service.getByProprietaire(id); }

    @PostMapping
    public RestaurantDTO create(@RequestBody RestaurantDTO dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public RestaurantDTO update(@PathVariable Long id, @RequestBody RestaurantDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
