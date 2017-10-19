package com.dataart.events;

import org.apache.commons.lang.StringUtils;

import java.util.Arrays;
import java.util.stream.Collectors;

public class LoggerDescriptionFormat {
    private static int PAD = 40;
    private static String formatDesciptionLine(String text) {
        return StringUtils.rightPad("    " + text, PAD, " ") + ": [{}],\r\n";
    }

    static String loggerDescriptionString(String eventName, String[] descriptionFields) {
        return "Event " + eventName + " with \r\n" +
                Arrays.stream(descriptionFields)
                        .map(LoggerDescriptionFormat::formatDesciptionLine)
                        .collect(Collectors.joining(""));
    }
}
