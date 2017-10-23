package com.dataart.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.transaction.annotation.Propagation.MANDATORY;

@Repository
@Transactional(propagation = MANDATORY)
interface OrderRepository extends JpaRepository<Order, Integer> {

    Order findByHash(String hash);

    List<Order> findByStatus(String status);
}
