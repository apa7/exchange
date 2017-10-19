package com.dataart.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Transactional(readOnly = true)
    List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional(readOnly = false)
    Order placeOrder(Order order) {
        return orderRepository.saveAndFlush(order);
    }

    @Transactional(readOnly = true)
    Order getOrderByHash(String hash) {
        return orderRepository.findByHash(hash);
    }

    @Transactional(readOnly = true)
    List<Order> getOpenOrders() {
        return orderRepository.findByStatus("OPEN");
    }

    @Transactional(readOnly = false)
    public Order closeOrderByHash(String orderHash) {
        Order order = orderRepository.findByHash(orderHash);
        if (order == null) return null;
        order.setStatus("CLOSED");
        return orderRepository.saveAndFlush(order);
    }

    @Transactional (readOnly = false)
    public Order cancelOrderByHash(String orderHash) {
        Order order = orderRepository.findByHash(orderHash);
        if (order == null) return null;
        order.setStatus("CANCELLED");
        return orderRepository.saveAndFlush(order);
    }
}
