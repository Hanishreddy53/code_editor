package com.example.codeeditor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PresenceDTO {
    private String type;       // "join" or "leave"
    private String username;
    private List<String> users;
}
