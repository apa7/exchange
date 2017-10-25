package com.dataart.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MarketOrder {
    String tokenToBuyAddress;
    String tokenToSellAddress;

    String tokenToBuyAmount;
}
