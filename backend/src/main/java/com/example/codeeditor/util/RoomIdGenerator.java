package com.example.codeeditor.util;

import java.util.UUID;

public class RoomIdGenerator {

    public static String generateRoomId() {
        return UUID.randomUUID().toString();
    }
}