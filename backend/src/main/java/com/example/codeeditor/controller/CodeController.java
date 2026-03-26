package com.example.codeeditor.controller;

import com.example.codeeditor.model.CodeHistory;
import com.example.codeeditor.service.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/code")
public class CodeController {

    @Autowired
    private CodeService codeService;

    @PostMapping("/save")
    public CodeHistory saveCode(@RequestBody com.example.codeeditor.dto.CodeUpdateDTO dto) {
        return codeService.saveCode(dto.getRoomId(), dto.getCode(), dto.getEditedBy());
    }
}