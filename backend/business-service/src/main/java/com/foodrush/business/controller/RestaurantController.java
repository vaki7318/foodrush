package com.foodrush.business.controller;

import com.foodrush.business.model.Restaurant;
import com.foodrush.business.service.RestaurantService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantService service;
    public RestaurantController(RestaurantService s) { this.service = s; }
    
    @GetMapping public List<Restaurant> getAll() { return service.getAll(); }
    @GetMapping("/{id}") public Restaurant getById(@PathVariable Long id) { return service.getById(id); }
    @GetMapping("/categorie/{cat}") public List<Restaurant> getByCat(@PathVariable String cat) { return service.getByCategorie(cat); }
    @GetMapping("/proprietaire/{id}") public List<Restaurant> getByProp(@PathVariable String id) { return service.getByProprietaire(id); }
    @PostMapping public Restaurant create(@RequestBody Restaurant r) { return service.create(r); }
    @PutMapping("/{id}") public Restaurant update(@PathVariable Long id, @RequestBody Restaurant r) { return service.update(id, r); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }
}
