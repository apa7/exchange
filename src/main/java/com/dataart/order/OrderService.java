package com.dataart.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional(readOnly = false)
    public Order placeOrder(Order order) {
        return orderRepository.saveAndFlush(order);
    }

    @Transactional(readOnly = true)
    public Order getOrderByHash(String hash) {
        return orderRepository.findByHash(hash);
    }

    @Transactional(readOnly = true)
    public List<Order> getOpenOrders() {
        return orderRepository.findByStatus("OPEN");
    }

    @Transactional(readOnly = false)
    public Order partialCancel(String orderHash, BigInteger cancelAmount) {
        Order order = orderRepository.findByHash(orderHash);
        if (order == null) return null;
        order.addCancelled(cancelAmount);
        if (order.checkStatus()) {
            order.setStatus("CLOSED");
        }
        return orderRepository.saveAndFlush(order);
    }

    @Transactional(readOnly = false)
    public Order partialFill(String orderHash, BigInteger fillAmount) {
        Order order = orderRepository.findByHash(orderHash);
        if (order == null) return null;
        order.addFilled(fillAmount);
        if (order.checkStatus()) {
            order.setStatus("CLOSED");
        }
        return orderRepository.saveAndFlush(order);
    }

    @Transactional(readOnly = true)
    private List<Order> getOpenOrdersForTokenPair(String makerToken, String takerToken) {
        return orderRepository.findByMakerTokenAddressAndTakerTokenAddressAndStatus(makerToken, takerToken, "OPEN");
    }

    @Transactional(readOnly = true)
    private List<Order> getSortedOrdersForTokenPair(String makerToken, String takerToken) {
        List<Order> tokenPairOrders = getOpenOrdersForTokenPair(makerToken, takerToken);
        tokenPairOrders.sort(Comparator.comparing(Order::getPrice));
        return tokenPairOrders;
    }

    BigInteger currentOrderFillAmount(Order order, BigInteger makerTokensToFill) {
        if (order.getOpenMakerTokens().compareTo(makerTokensToFill) >= 0) {
            return makerTokensToFill.multiply(order.getPrice());
        }
        return order.getOpenValue();
    }

    BigInteger makerTokensFillAmount(Order order, BigInteger makerTokensToFill) {
        if (order.getOpenMakerTokens().compareTo(makerTokensToFill) >= 0) {
            return makerTokensToFill;
        }
        return order.getOpenMakerTokens();
    }

    List<OrderFill> getFillsForMarketOrder(MarketOrder order) {
        List<OrderFill> result = new ArrayList<>();
        List<Order> orders = getSortedOrdersForTokenPair(order.tokenToBuyAddress, order.tokenToSellAddress);
        BigInteger amount = order.tokenToBuyAmount;
        for (int i = 0; i < orders.size() && amount.compareTo(BigInteger.ZERO) > 0; ++i) {
            BigInteger fill = currentOrderFillAmount(orders.get(i), amount);
            BigInteger makerFill = makerTokensFillAmount(orders.get(i), amount);
            result.add(new OrderFill(orders.get(i), fill));
            amount = amount.subtract(makerFill);
        }
        return result;
    }
}
