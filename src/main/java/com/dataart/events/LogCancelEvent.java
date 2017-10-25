package com.dataart.events;

import com.dataart.order.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.web3j.protocol.core.methods.response.Log;

import java.math.BigInteger;

@Component
public class LogCancelEvent {
    private final Logger LOGGER = LoggerFactory.getLogger(LogCancelEvent.class);
    static String TOPIC = EncodeEvent.buildEventSignature(
            "LogCancel(address,address,address,address,uint256,uint256,bytes32,bytes32)");
    private final String[] DESCRIPTION_FIELDS = {
            "maker address",
            "fee recepient address",
            "token pair hash",
            "maker token contract",
            "taker token contract",
            "maker tokens cancelled",
            "taker tokens cancelled",
            "order hash",
            "tx hash"
    };

    @Autowired
    private OrderService orderService;

    public String getEventName() {
        return "LogCancel";
    }

    private String getTransactionHash(Log ethLogObject) {
        return ethLogObject.getTransactionHash();
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
        TAKER:                   [0, 66)
        MAKER TOKEN CONTRACT:    [2, 66)
        TAKER TOKEN CONTRACT:    [66, 130)
        MAKER TOKENS CANCELLED:  [130, 194)
        TAKER TOKENS CANCELLED:  [194, 258)
        ORDER HASH:              [258, 322)
     */
    private String formatHexStringFromData(Log ethLogObject, int startIndex, int endIndex) {
        return "0x" + ethLogObject.getData().substring(startIndex, endIndex);
    }

    private BigInteger formatUintStringFromData(Log ethLogObject, int startIndex, int endIndex) {
        return new BigInteger(ethLogObject.getData().substring(startIndex, endIndex), 16);
    }

    private String getMakerTokenAddress(Log ethLogObject) {
        return formatHexStringFromData(ethLogObject, 26, 66);
    }

    private String getTakerTokenAddress(Log ethLogObject) {
        return formatHexStringFromData(ethLogObject, 90, 130);
    }

    private BigInteger getMakerTokenCancelled(Log ethLogObject) {
        return formatUintStringFromData(ethLogObject, 130, 194);
    }

    private BigInteger getTakerTokenCancelled(Log ethLogObject) {
        return formatUintStringFromData(ethLogObject, 194, 258);
    }

    private String getOrderHash(Log ethLogObject) {
        return formatHexStringFromData(ethLogObject, 258, 322);
    }

    void processEvent(Log ethLogObject) {
        String orderHash = getOrderHash(ethLogObject);
        orderService.partialCancel(orderHash, getTakerTokenCancelled(ethLogObject));

        LOGGER.info(
                LoggerDescriptionFormat.loggerDescriptionString(getEventName(), DESCRIPTION_FIELDS),
                getMakerAddress(ethLogObject),
                getFeeRecipientAddress(ethLogObject),
                getTokenPairHash(ethLogObject),
                getMakerTokenAddress(ethLogObject),
                getTakerTokenAddress(ethLogObject),
                getMakerTokenCancelled(ethLogObject),
                getTakerTokenCancelled(ethLogObject),
                getOrderHash(ethLogObject),
                getTransactionHash(ethLogObject)
        );
    }
}
