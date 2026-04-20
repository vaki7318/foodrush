package com.foodrush.business.repository;

import com.foodrush.business.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByClientId(String clientId);
    List<Commande> findByRestaurantId(Long restaurantId);
}
