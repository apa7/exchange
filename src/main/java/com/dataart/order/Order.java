package com.dataart.order;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.BigInteger;

import static javax.persistence.GenerationType.IDENTITY;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders_partial")
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    //address of the 0x Exchange contract
    private String exchangeContract;

    private BigInteger expirationTime;
    //relayer address
    private String feeRecipient;

    private String maker;
    private BigInteger makerFee;
    private String makerTokenAddress;
    private BigInteger makerTokenValue;

    private String taker;
    private BigInteger takerFee;
    private String takerTokenAddress;
    private BigInteger takerTokenValue;

    private String salt;

    private String status;

    @Column(name = "signature_v")
    private int signatureV;
    @Column(name = "signature_s")
    private String signatureS;
    @Column(name = "signature_r")
    private String signatureR;

    private String hash;

    private BigInteger filled;
    private BigInteger cancelled;

    public void addFilled(BigInteger add) {
        filled = filled.add(add);
    }

    public void addCancelled(BigInteger cancel) {
        cancelled = cancelled.add(cancel);
    }

    public boolean checkStatus() {
        return (filled.add(cancelled).compareTo(takerTokenValue) == 0 &&
                status.equalsIgnoreCase("OPEN"));
    }

    @JsonInclude
    public BigInteger getOpenValue() {
        return takerTokenValue.subtract(filled).subtract(cancelled);
    }

    public BigDecimal filledCoefficient() {
        return new BigDecimal(getOpenValue())
                .divide(new BigDecimal(getTakerTokenValue()), 10, BigDecimal.ROUND_HALF_UP);
    }

    public BigInteger getOpenMakerTokens() {
        return filledCoefficient().multiply(new BigDecimal(makerTokenValue)).toBigInteger();
    }

    public BigInteger getPrice() {
        return takerTokenValue.divide(makerTokenValue);
    }
}
