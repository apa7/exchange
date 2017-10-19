package com.dataart.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.http.HttpService;

@Service
public class Web3EventListener {
    private final Web3j web3 = Web3j.build(new HttpService());
    private static String exchangeContractAddress = "0x90Fe2Af704B34E0224bF2299C838E04d4Dcf1364";

    @Autowired
    public Web3EventListener(LogFillEvent logFillEvent, LogCancelEvent logCancelEvent) {
        EthFilter fillFilter = new EthFilter(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST, exchangeContractAddress)
            .addSingleTopic(LogFillEvent.TOPIC);
        web3
                .ethLogObservable(fillFilter)
                .subscribe(log -> logFillEvent.processEvent(log));

        EthFilter cancelFilter = new EthFilter(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST, exchangeContractAddress)
                .addSingleTopic(LogCancelEvent.TOPIC);
        web3
                .ethLogObservable(cancelFilter)
                .subscribe(log -> logCancelEvent.processEvent(log));
    }
}
