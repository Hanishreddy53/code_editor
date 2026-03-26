package com.example.codeeditor.service;

import com.example.codeeditor.model.Room;
import com.example.codeeditor.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public Room createRoom(String name, String pin) {
        Room room = new Room();
        room.setRoomCode(UUID.randomUUID().toString().substring(0, 8));
        room.setName(name);
        if (pin != null && !pin.isBlank()) {
            room.setPin(pin.trim());
        }
        return roomRepository.save(room);
    }

    public boolean verifyPin(Long roomId, String pin) {
        Room room = getRoomById(roomId);
        if (!room.isLocked()) return true; // no PIN required
        return room.getPin().equals(pin);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}