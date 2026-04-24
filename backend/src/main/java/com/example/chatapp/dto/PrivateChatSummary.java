package com.example.chatapp.dto;

import java.time.LocalDateTime;

public record PrivateChatSummary(String username, LocalDateTime lastMessageAt) {
}
