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
    public Order partialCancel(String orderHash, String cancelAmount) {
        Order order = orderRepository.findByHash(orderHash);
        if (order == null) return null;
        order.addCancelled(cancelAmount);
        if (order.checkStatus()) {
            order.setStatus("CLOSED");
        }
        return orderRepository.saveAndFlush(order);
    }

    @Transactional(readOnly = false)
    public Order partialFill(String orderHash, String fillAmount) {
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

    String currentOrderFillAmount(Order order, BigInteger makerTokensToFill) {
        if (order.getOpenMakerTokens().compareTo(makerTokensToFill) >= 0) {
            return makerTokensToFill.multiply(order.getPrice()).toString();
        }
        return order.getOpenValue();
    }

    String makerTokensFillAmount(Order order, BigInteger makerTokensToFill) {
        if (order.getOpenMakerTokens().compareTo(makerTokensToFill) >= 0) {
            return makerTokensToFill.toString();
        }
        return order.getOpenMakerTokens().toString();
    }

    List<OrderFill> getFillsForMarketOrder(MarketOrder order) {
        List<OrderFill> result = new ArrayList<>();
        List<Order> orders = getSortedOrdersForTokenPair(order.tokenToBuyAddress, order.tokenToSellAddress);
        String amount = order.tokenToBuyAmount;
        for (int i = 0; i < orders.size() && new BigInteger(amount).compareTo(BigInteger.ZERO) > 0; ++i) {
            String fill = currentOrderFillAmount(orders.get(i), new BigInteger(amount));
            String makerFill = makerTokensFillAmount(orders.get(i), new BigInteger(amount));
            result.add(new OrderFill(orders.get(i), fill));
            amount = new BigInteger(amount).subtract(new BigInteger(makerFill)).toString();
        }
        return result;
    }
}
