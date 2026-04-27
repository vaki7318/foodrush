package com.foodrush.business.controller;

import com.foodrush.business.dto.PlatDTO;
import com.foodrush.business.service.PlatService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plats")
public class PlatController {
    private final PlatService service;
    public PlatController(PlatService s) { this.service = s; }

    @GetMapping("/restaurant/{id}")
    public List<PlatDTO> getByRestaurant(@PathVariable Long id) { return service.getByRestaurant(id); }

    @GetMapping("/{id}")
    public PlatDTO getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public PlatDTO create(@RequestBody PlatDTO dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public PlatDTO update(@PathVariable Long id, @RequestBody PlatDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
