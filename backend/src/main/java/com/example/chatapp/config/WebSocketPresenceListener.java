package com.example.chatapp.config;

import com.example.chatapp.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketPresenceListener {

    private final PresenceService presenceService;

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        if (accessor.getUser() == null) {
            return;
        }

        presenceService.markOnline(accessor.getSessionId(), accessor.getUser().getName());
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        presenceService.markOffline(event.getSessionId());
    }
}
