package com.example.chatapp.dto;

import com.example.chatapp.model.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageStatusUpdate {
    private Long messageId;
    private Message.MessageStatus status;
    private String sender;
    private String recipient;
}
