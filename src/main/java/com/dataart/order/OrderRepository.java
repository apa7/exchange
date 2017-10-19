package com.dataart.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
interface OrderRepository extends JpaRepository<Order, Integer> {
    Order findByHash(String hash);
    List<Order> findByStatus(String status);
}
