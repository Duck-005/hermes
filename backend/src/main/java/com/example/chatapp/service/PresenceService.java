package com.example.chatapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private final SimpMessagingTemplate messagingTemplate;

    private final Map<String, String> sessionUsers = new ConcurrentHashMap<>();
    private final Map<String, Integer> activeSessionCounts = new ConcurrentHashMap<>();

    public void markOnline(String sessionId, String username) {
        if (sessionId == null || username == null || username.isBlank()) {
            return;
        }

        sessionUsers.put(sessionId, username);
        activeSessionCounts.merge(username, 1, Integer::sum);
        broadcastPresence();
    }

    public void markOffline(String sessionId) {
        if (sessionId == null) {
            return;
        }

        String username = sessionUsers.remove(sessionId);
        if (username == null) {
            return;
        }

        activeSessionCounts.computeIfPresent(username, (key, count) -> count > 1 ? count - 1 : null);
        broadcastPresence();
    }

    public List<String> getOnlineUsers() {
        return activeSessionCounts.keySet().stream().sorted().toList();
    }

    public void broadcastPresence() {
        messagingTemplate.convertAndSend("/topic/public.presence", getOnlineUsers());
    }
}
