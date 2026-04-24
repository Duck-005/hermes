package com.example.chatapp.controller;

import com.example.chatapp.dto.UserSummary;
import com.example.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/{username}")
    public ResponseEntity<UserSummary> getUserByUsername(@PathVariable String username) {
        UserSummary user = userRepository.findByUsername(username)
                .map(foundUser -> new UserSummary(foundUser.getId(), foundUser.getUsername()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User does not exist"));

        return ResponseEntity.ok(user);
    }
}
