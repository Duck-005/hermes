package com.example.chatapp.controller;

import com.example.chatapp.dto.UserSummary;
import com.example.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserSummary>> getAllUsers() {
        List<UserSummary> users = userRepository.findAllByOrderByUsernameAsc()
                .stream()
                .map(user -> new UserSummary(user.getId(), user.getUsername()))
                .toList();

        return ResponseEntity.ok(users);
    }
}
