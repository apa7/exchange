package com.dataart.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigInteger;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MarketOrder {
    String tokenToBuyAddress;
    String tokenToSellAddress;

    BigInteger tokenToBuyAmount;
}
