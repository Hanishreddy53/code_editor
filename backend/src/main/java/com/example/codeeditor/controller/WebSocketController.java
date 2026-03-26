package com.example.codeeditor.controller;

import com.example.codeeditor.dto.CodeUpdateDTO;
import com.example.codeeditor.dto.JoinRoomDTO;
import com.example.codeeditor.dto.LanguageUpdateDTO;
import com.example.codeeditor.dto.PresenceDTO;
import com.example.codeeditor.service.CodeService;
import com.example.codeeditor.service.RoomPresenceService;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate template;
    private final CodeService codeService;
    private final RoomPresenceService presenceService;

    public WebSocketController(SimpMessagingTemplate template,
                               CodeService codeService,
                               RoomPresenceService presenceService) {
        this.template = template;
        this.codeService = codeService;
        this.presenceService = presenceService;
    }

    @MessageMapping("/code.update/{roomId}")
    public void updateCode(@Payload CodeUpdateDTO dto,
                           @DestinationVariable String roomId,
                           @Header("simpSessionId") String sessionId) {
        // persist code
        try {
            Long rid = Long.parseLong(roomId);
            codeService.saveCode(rid, dto.getCode(), dto.getEditedBy());
        } catch (Exception e) {
            // log and continue
            e.printStackTrace();
        }

        // broadcast to subscribers with info about who edited
        template.convertAndSend("/topic/code/" + roomId, dto);
    }

    @MessageMapping("/room.join/{roomId}")
    public void joinRoom(@Payload JoinRoomDTO dto,
                         @DestinationVariable String roomId,
                         @Header("simpSessionId") String sessionId) {
        List<String> users = presenceService.addUser(roomId, dto.getUsername(), sessionId);
        PresenceDTO presence = new PresenceDTO("join", dto.getUsername(), users);
        template.convertAndSend("/topic/presence/" + roomId, presence);
    }

    @MessageMapping("/language.update/{roomId}")
    public void updateLanguage(@Payload LanguageUpdateDTO dto,
                               @DestinationVariable String roomId) {
        // broadcast language change to all users in the room
        template.convertAndSend("/topic/language/" + roomId, dto);
    }
}