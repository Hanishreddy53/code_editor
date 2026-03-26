package com.example.codeeditor.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CodeSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionName;
}