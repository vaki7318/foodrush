package com.foodrush.business.repository;

import com.foodrush.business.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByProprietaireId(String proprietaireId);
    List<Restaurant> findByCategorie(String categorie);
}
