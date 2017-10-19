package com.dataart.events;

import com.dataart.order.OrderService;
import org.apache.commons.lang.StringUtils;
import org.bouncycastle.jcajce.provider.symmetric.DES;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.web3j.protocol.core.methods.response.Log;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.stream.Collectors;

/*
    event LogFill(
        address indexed maker,
        address taker,
        address indexed feeRecipient,
        address makerToken,
        address takerToken,
        uint filledMakerTokenAmount,
        uint filledTakerTokenAmount,
        uint paidMakerFee,
        uint paidTakerFee,
        bytes32 indexed tokens, // keccak256(makerToken, takerToken), allows subscribing to a token pair
        bytes32 orderHash
    );
*/

@Component
public class LogFillEvent {
    private final Logger LOGGER = LoggerFactory.getLogger(LogFillEvent.class);
    static String TOPIC = EncodeEvent.buildEventSignature(
            "LogFill(address,address,address,address,address,uint256,uint256,uint256,uint256,bytes32,bytes32)");
    private final String[] DESCRIPTION_FIELDS = {
            "maker address",
            "fee recepient address",
            "token pair hash",
            "taker address",
            "maker token contract",
            "taker token contract",
            "maker tokens filled",
            "taker tokens filled",
            "maker fee paid",
            "taker fee paid",
            "order hash"
    };

    @Autowired
    private OrderService orderService;

    public String getEventName() {
        return "LogFill";
    }

    //indexed fields
    private String getMakerAddress(Log ethLogObject) {
        return "0x" + ethLogObject.getTopics().get(1).substring(26, 66);
    }

    private String getFeeRecipientAddress(Log ethLogObject) {
        return "0x" + ethLogObject.getTopics().get(2).substring(26, 66);
    }

    private String getTokenPairHash(Log ethLogObject) {
        return ethLogObject.getTopics().get(3);
    }

    //unindexed fields
    //addresses are formatted in the following way: 00....0(*24)xxx...x(*40)
    /*
        TAKER:                [2, 66)
        MAKER TOKEN CONTRACT: [66, 130)
        TAKER TOKEN CONTRACT: [130, 194)
        MAKER TOKENS FILLED:  [194, 258)
        TAKER TOKENS FILLED:  [258, 322)
        MAKER PAID FEE:       [322, 386)
        TAKER PAID FEE:       [386, 450)
        ORDER HASH:           [450, 514)
     */
    private String formatHexStringFromData(Log ethLogObject, int startIndex, int endIndex) {
        return "0x" + ethLogObject.getData().substring(startIndex, endIndex);
    }

    private BigInteger formatUintStringFromData(Log ethLogObject, int startIndex, int endIndex) {
        return new BigInteger(ethLogObject.getData().substring(startIndex, endIndex), 16);
    }

    private String getTakerAddress(Log ethLogObject) {
        return formatHexStringFromData(ethLogObject,26, 66);
    }

    private String getMakerTokenAddress(Log ethLogObject) {
        return formatHexStringFromData(ethLogObject,90, 130);
    }

    private String getTakerTokenAddress(Log ethLogObject) {
        return formatHexStringFromData(ethLogObject,154, 194);
    }

    private BigInteger getMakerTokenFilled(Log ethLogObject) {
        return formatUintStringFromData(ethLogObject,194, 258);
    }

    private BigInteger getTakerTokenFilled(Log ethLogObject) {
        return formatUintStringFromData(ethLogObject,258, 322);
    }

    private BigInteger getMakerPaidFee(Log ethLogObject) {
        return formatUintStringFromData(ethLogObject,322, 386);
    }

    private BigInteger getTakerPaidFee(Log ethLogObject) {
        return formatUintStringFromData(ethLogObject,386, 450);
    }

    private String getOrderHash(Log ethLogObject) {
        return formatHexStringFromData(ethLogObject,450, 514);
    }

    void processEvent(Log ethLogObject) {
        String orderHash = getOrderHash(ethLogObject);
        orderService.closeOrderByHash(orderHash);

        LOGGER.info(LoggerDescriptionFormat.loggerDescriptionString(getEventName(), DESCRIPTION_FIELDS),
                getMakerAddress(ethLogObject), getFeeRecipientAddress(ethLogObject),
                getTokenPairHash(ethLogObject), getTakerAddress(ethLogObject),
                getMakerTokenAddress(ethLogObject), getTakerTokenAddress(ethLogObject),
                getMakerTokenFilled(ethLogObject), getTakerTokenFilled(ethLogObject),
                getMakerPaidFee(ethLogObject), getTakerPaidFee(ethLogObject), getOrderHash(ethLogObject));
    }
}
