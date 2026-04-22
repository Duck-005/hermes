package com.example.chatapp.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String content;
    private String sender;
    private MessageType type;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
