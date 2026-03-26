package com.example.codeeditor.controller;

import com.example.codeeditor.model.Room;
import com.example.codeeditor.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestParam String name,
                                            @RequestParam(required = false) String pin) {
        Room room = roomService.createRoom(name, pin);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {
        Room room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/{id}/verify-pin")
    public ResponseEntity<?> verifyPin(@PathVariable Long id,
                                       @RequestBody java.util.Map<String, String> body) {
        String pin = body.get("pin");
        boolean valid = roomService.verifyPin(id, pin);
        if (valid) {
            return ResponseEntity.ok(java.util.Map.of("valid", true));
        }
        return ResponseEntity.status(403).body(java.util.Map.of("valid", false, "message", "Invalid PIN"));
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }
}