package com.foodrush.business.controller;

import com.foodrush.business.model.Commande;
import com.foodrush.business.service.CommandeService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    private final CommandeService service;
    public CommandeController(CommandeService s) { this.service = s; }
    
    @GetMapping("/client/{id}") public List<Commande> getByClient(@PathVariable String id) { return service.getByClient(id); }
    @GetMapping("/restaurant/{id}") public List<Commande> getByRestaurant(@PathVariable Long id) { return service.getByRestaurant(id); }
    @PostMapping public Commande create(@RequestBody Commande c) { return service.create(c); }
    @PutMapping("/{id}/statut") public Commande updateStatut(@PathVariable Long id, @RequestBody Map<String, String> body) { 
        return service.updateStatut(id, body.get("statut")); 
    }
}
