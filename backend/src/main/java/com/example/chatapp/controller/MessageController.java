package com.example.chatapp.controller;

import com.example.chatapp.dto.ChatMessage;
import com.example.chatapp.dto.MessageStatusUpdate;
import com.example.chatapp.model.Message;
import com.example.chatapp.repository.MessageRepository;
import com.example.chatapp.service.MessageService;
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
    private final MessageService messageService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return saveMessage(chatMessage);
    }

    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMessage = saveMessage(chatMessage);
        // recipient will receive on /user/<username>/queue/messages
        messagingTemplate.convertAndSendToUser(
                savedMessage.getRecipient(),
                "/queue/messages",
                savedMessage
        );
        messagingTemplate.convertAndSendToUser(
                savedMessage.getSender(),
                "/queue/messages",
                savedMessage
        );
    }

    @MessageMapping("/chat.groupMessage")
    public void sendGroupMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMessage = saveMessage(chatMessage);
        // broadcast to /topic/room.{roomId}
        messagingTemplate.convertAndSend(
                "/topic/room." + savedMessage.getRoomId(),
                savedMessage
        );
    }

    @MessageMapping("/chat.updateStatus")
    public void updateMessageStatus(@Payload MessageStatusUpdate statusUpdate) {
        messageService.updateMessageStatus(statusUpdate.getMessageId(), statusUpdate.getStatus());
        
        // Notify the original sender about the status change
        messagingTemplate.convertAndSendToUser(
                statusUpdate.getRecipient(), // The original sender
                "/queue/status",
                statusUpdate
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

    @MessageMapping("/chat.joinRoom")
    public void joinRoom(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("room_id", chatMessage.getRoomId());
        }
        messagingTemplate.convertAndSend(
                "/topic/room." + chatMessage.getRoomId(),
                chatMessage // type JOIN expected
        );
    }

    private ChatMessage saveMessage(ChatMessage chatMessage) {
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT) {
            Message message = Message.builder()
                    .sender(chatMessage.getSender())
                    .recipient(chatMessage.getRecipient() != null ? chatMessage.getRecipient() : "GROUP")
                    .roomId(chatMessage.getRoomId())
                    .content(chatMessage.getContent())
                    .timestamp(LocalDateTime.now())
                    .status(Message.MessageStatus.SENT)
                    .build();
            Message savedMessage = messageRepository.save(message);
            return ChatMessage.builder()
                    .id(savedMessage.getId())
                    .content(savedMessage.getContent())
                    .sender(savedMessage.getSender())
                    .recipient("GROUP".equals(savedMessage.getRecipient()) ? null : savedMessage.getRecipient())
                    .roomId(savedMessage.getRoomId())
                    .timestamp(savedMessage.getTimestamp())
                    .status(savedMessage.getStatus())
                    .type(chatMessage.getType())
                    .build();
        }

        return chatMessage;
    }
}
