package com.example.chatapp.service;

import com.example.chatapp.dto.PrivateChatSummary;
import com.example.chatapp.model.Message;
import com.example.chatapp.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository repository;

    public Page<Message> getPrivateMessageHistory(String user1, String user2, Pageable pageable) {
        return repository.findPrivateMessages(user1, user2, pageable);
    }

    public List<PrivateChatSummary> getPrivateChats(String currentUser) {
        List<Message> messages = repository.findPrivateMessagesForUser(currentUser);
        Map<String, PrivateChatSummary> chatsByUsername = new LinkedHashMap<>();

        for (Message message : messages) {
            String otherUser = currentUser.equals(message.getSender())
                    ? message.getRecipient()
                    : message.getSender();

            chatsByUsername.putIfAbsent(
                    otherUser,
                    new PrivateChatSummary(otherUser, message.getTimestamp())
            );
        }

        return chatsByUsername.values().stream().toList();
    }

    public Page<Message> getRoomMessageHistory(String roomId, Pageable pageable) {
        return repository.findAllByRoomIdOrderByTimestampDesc(roomId, pageable);
    }

    public void updateMessageStatus(Long messageId, Message.MessageStatus status) {
        repository.findById(messageId).ifPresent(message -> {
            message.setStatus(status);
            repository.save(message);
        });
    }
}
