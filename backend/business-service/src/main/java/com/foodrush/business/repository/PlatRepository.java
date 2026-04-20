package com.foodrush.business.repository;

import com.foodrush.business.model.Plat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlatRepository extends JpaRepository<Plat, Long> {
    List<Plat> findByRestaurantId(Long restaurantId);
}
