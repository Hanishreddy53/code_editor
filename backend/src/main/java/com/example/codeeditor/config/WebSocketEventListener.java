package com.example.codeeditor.config;

import com.example.codeeditor.dto.PresenceDTO;
import com.example.codeeditor.service.RoomPresenceService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
public class WebSocketEventListener {

    private final RoomPresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(RoomPresenceService presenceService,
                                  SimpMessagingTemplate messagingTemplate) {
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        String roomId = presenceService.getRoomIdForSession(sessionId);

        if (roomId != null) {
            List<String> remainingUsers = presenceService.removeUser(sessionId);
            PresenceDTO presence = new PresenceDTO("leave", null, remainingUsers);
            messagingTemplate.convertAndSend("/topic/presence/" + roomId, presence);
        }
    }
}
