package com.dataart.tokens;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TokenService {
    @Transactional
    List<Token> getAllTokens();
}
