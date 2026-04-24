package com.example.chatapp.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException exception) {
        HttpStatusCode statusCode = exception.getStatusCode();

        return ResponseEntity.status(statusCode).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", statusCode.value(),
                "error", statusCode.toString(),
                "message", exception.getReason() == null ? "Request failed" : exception.getReason()
        ));
    }
}
