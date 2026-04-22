package com.example.chatapp.controller;

import com.example.chatapp.dto.ChatMessage;
import com.example.chatapp.model.Message;
import com.example.chatapp.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        saveMessage(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        saveMessage(chatMessage);
        // recipient will receive on /user/<username>/queue/messages
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipient(),
                "/queue/messages",
                chatMessage
        );
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        }
        return chatMessage;
    }

    private void saveMessage(ChatMessage chatMessage) {
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
            Message message = Message.builder()
                    .sender(chatMessage.getSender())
                    .recipient(chatMessage.getRecipient() != null ? chatMessage.getRecipient() : "PUBLIC")
                    .content(chatMessage.getContent())
                    .timestamp(LocalDateTime.now())
                    .status(Message.MessageStatus.SENT)
                    .build();
            messageRepository.save(message);
        }
    }
}
