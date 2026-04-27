package com.foodrush.business.controller;

import com.foodrush.business.dto.CommandeDTO;
import com.foodrush.business.service.CommandeService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    private final CommandeService service;
    public CommandeController(CommandeService s) { this.service = s; }

    @GetMapping("/client/{id}")
    public List<CommandeDTO> getByClient(@PathVariable String id) { return service.getByClient(id); }

    @GetMapping("/restaurant/{id}")
    public List<CommandeDTO> getByRestaurant(@PathVariable Long id) { return service.getByRestaurant(id); }

    @PostMapping
    public CommandeDTO create(@RequestBody CommandeDTO dto) { return service.create(dto); }

    @PutMapping("/{id}/statut")
    public CommandeDTO updateStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateStatut(id, body.get("statut"));
    }
}
