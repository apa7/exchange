package com.dataart.tokens;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TokenService {
    @Autowired
    private TokenRepository defaultTokenRepository;
    
    @Transactional
    public List<Token> getAllTokens() {
        return defaultTokenRepository.findAll();
    }
}
