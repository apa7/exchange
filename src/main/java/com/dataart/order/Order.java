package com.dataart.order;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigInteger;

import static javax.persistence.GenerationType.IDENTITY;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
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
    private String makerTokenValue;

    private String taker;
    private BigInteger takerFee;
    private String takerTokenAddress;
    private String takerTokenValue;

    private String salt;

    private String status;

    @Column(name = "signature_v")
    private int signatureV;
    @Column(name = "signature_s")
    private String signatureS;
    @Column(name = "signature_r")
    private String signatureR;

    private String hash;
}
