package com.example.chatapp.controller;

import com.example.chatapp.dto.PrivateChatSummary;
import com.example.chatapp.model.Message;
import com.example.chatapp.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class HistoryController {

    private final MessageService messageService;

    @GetMapping("/private-chats")
    public ResponseEntity<List<PrivateChatSummary>> getPrivateChats() {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(messageService.getPrivateChats(currentUser));
    }

    @GetMapping("/private/{otherUser}")
    public ResponseEntity<Page<Message>> getPrivateHistory(
            @PathVariable String otherUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(messageService.getPrivateMessageHistory(currentUser, otherUser, PageRequest.of(page, size)));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<Page<Message>> getRoomHistory(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(messageService.getRoomMessageHistory(roomId, PageRequest.of(page, size)));
    }
}
