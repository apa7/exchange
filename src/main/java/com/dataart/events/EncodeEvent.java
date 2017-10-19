package com.dataart.events;

import org.web3j.crypto.Hash;
import org.web3j.utils.Numeric;

public class EncodeEvent {
    static public String buildEventSignature(String methodSignature) {
        byte[] input = methodSignature.getBytes();
        byte[] hash = Hash.sha3(input);
        return Numeric.toHexString(hash);
    }
}
