package com.example.chatapp.service;

import com.example.chatapp.model.Message;
import com.example.chatapp.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository repository;

    public Page<Message> getPrivateMessageHistory(String user1, String user2, Pageable pageable) {
        return repository.findPrivateMessages(user1, user2, pageable);
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
