package com.example.codeeditor.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomPresenceService {

    // roomId -> Set of usernames
    private final ConcurrentHashMap<String, Set<String>> roomUsers = new ConcurrentHashMap<>();

    // sessionId -> { roomId, username }
    private final ConcurrentHashMap<String, String[]> sessionInfo = new ConcurrentHashMap<>();

    public List<String> addUser(String roomId, String username, String sessionId) {
        sessionInfo.put(sessionId, new String[]{roomId, username});
        roomUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(username);
        return getUsers(roomId);
    }

    public List<String> removeUser(String sessionId) {
        String[] info = sessionInfo.remove(sessionId);
        if (info != null) {
            String roomId = info[0];
            String username = info[1];
            Set<String> users = roomUsers.get(roomId);
            if (users != null) {
                users.remove(username);
                if (users.isEmpty()) {
                    roomUsers.remove(roomId);
                }
            }
            return getUsers(roomId);
        }
        return Collections.emptyList();
    }

    public String getRoomIdForSession(String sessionId) {
        String[] info = sessionInfo.get(sessionId);
        return info != null ? info[0] : null;
    }

    public List<String> getUsers(String roomId) {
        Set<String> users = roomUsers.get(roomId);
        if (users == null) return Collections.emptyList();
        return new ArrayList<>(users);
    }
}
