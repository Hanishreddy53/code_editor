package com.example.codeeditor.dto;

import lombok.Data;

@Data
public class CodeUpdateDTO {
    private Long roomId;
    private String code;
    private String editedBy;
}