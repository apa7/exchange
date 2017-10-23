package com.dataart.order;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderService {
    @Transactional(readOnly = true)
    List<Order> getAllOrders();

    @Transactional(readOnly = false)
    Order placeOrder(Order order);

    @Transactional(readOnly = true)
    Order getOrderByHash(String hash);

    @Transactional(readOnly = true)
    List<Order> getOpenOrders();

    @Transactional(readOnly = false)
    Order closeOrderByHash(String orderHash);

    @Transactional(readOnly = false)
    Order cancelOrderByHash(String orderHash);
}
