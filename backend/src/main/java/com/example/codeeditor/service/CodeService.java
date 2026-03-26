package com.example.codeeditor.service;

import com.example.codeeditor.model.*;
import com.example.codeeditor.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodeService {

    @Autowired
    private CodeHistoryRepository repository;

    @Autowired
    private RoomRepository roomRepository;

    public CodeHistory saveCode(Long roomId, String code, String editedBy) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow();

        CodeHistory history = new CodeHistory();
        history.setRoom(room);
        history.setCode(code);
        history.setEditedBy(editedBy);

        return repository.save(history);
    }
}