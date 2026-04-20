package com.foodrush.business.controller;

import com.foodrush.business.model.Plat;
import com.foodrush.business.service.PlatService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plats")
public class PlatController {
    private final PlatService service;
    public PlatController(PlatService s) { this.service = s; }
    
    @GetMapping("/restaurant/{id}") public List<Plat> getByRestaurant(@PathVariable Long id) { return service.getByRestaurant(id); }
    @GetMapping("/{id}") public Plat getById(@PathVariable Long id) { return service.getById(id); }
    @PostMapping public Plat create(@RequestBody Plat p) { return service.create(p); }
    @PutMapping("/{id}") public Plat update(@PathVariable Long id, @RequestBody Plat p) { return service.update(id, p); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }
}
