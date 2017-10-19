package com.dataart.tokens;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@CrossOrigin(origins = "*")
@RequestMapping(value = "/tokens")
@RestController
public class TokenController {
    @Autowired
    TokenService tokenService;

    @RequestMapping(method = GET)
    public ResponseEntity getTokens() {
        List<Token> tokens = tokenService.getAllTokens();
        return ResponseEntity
                .status(OK)
                .body(tokens);
    }
}
