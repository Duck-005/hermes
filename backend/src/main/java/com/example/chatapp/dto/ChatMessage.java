package com.example.chatapp.dto;

import com.example.chatapp.model.Message;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private Long id;
    private String content;
    private String sender;
    private String recipient;
    private String roomId;
    private LocalDateTime timestamp;
    private Message.MessageStatus status;
    private MessageType type;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
