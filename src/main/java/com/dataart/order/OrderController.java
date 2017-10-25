package com.dataart.order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@CrossOrigin(origins = "*")
@RequestMapping(value = "/orders")
@RestController
public class OrderController {
    @Autowired
    private OrderService orderService;

    @RequestMapping(method = GET)
    ResponseEntity getOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity
                .status(OK)
                .body(orders);
    }

    @RequestMapping(value = "/open", method = GET)
    ResponseEntity getOpenOrders() {
        List<Order> orders = orderService.getOpenOrders();
        return ResponseEntity
                .status(OK)
                .body(orders);
    }

    @RequestMapping(value = "/{hash}", method = GET)
    ResponseEntity getOrder(@PathVariable String hash) {
        Order order = orderService.getOrderByHash(hash);
        return ResponseEntity
                .status(OK)
                .body(order);
    }

    @RequestMapping(method = POST)
    ResponseEntity postOrder(@RequestBody Order order) {
        Order createdOrder = orderService.placeOrder(order);
        return ResponseEntity
                .status(CREATED)
                .body(createdOrder);
    }

    @RequestMapping(value = "/market", method = POST)
    ResponseEntity getFills(@RequestBody MarketOrder order) {
        List<OrderFill> fills = orderService.getFillsForMarketOrder(order);
        return ResponseEntity
                .status(OK)
                .body(fills);
    }
}
