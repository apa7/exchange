package com.dataart.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = false)
    public Order placeOrder(Order order) {
        return orderRepository.saveAndFlush(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Order getOrderByHash(String hash) {
        return orderRepository.findByHash(hash);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getOpenOrders() {
        return orderRepository.findByStatus("OPEN");
    }

    @Override
    @Transactional(readOnly = false)
    public Order closeOrderByHash(String orderHash) {
        Order order = orderRepository.findByHash(orderHash);
        if (order == null) return null;
        order.setStatus("CLOSED");
        return orderRepository.saveAndFlush(order);
    }

    @Override
    @Transactional(readOnly = false)
    public Order cancelOrderByHash(String orderHash) {
        Order order = orderRepository.findByHash(orderHash);
        if (order == null) return null;
        order.setStatus("CANCELLED");
        return orderRepository.saveAndFlush(order);
    }
}
