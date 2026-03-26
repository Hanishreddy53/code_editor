package com.example.codeeditor.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String roomCode;

    private String name;

    private String pin; // null means no PIN (unlocked)

    public boolean isLocked() {
        return pin != null && !pin.isBlank();
    }
}