package com.dataart.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Order findByHash(String hash);

    List<Order> findByStatus(String status);

    List<Order> findByMakerTokenAddressAndTakerTokenAddressAndStatus(
            String makerTokenAddress,
            String takerTokenAddress,
            String status
    );
}
