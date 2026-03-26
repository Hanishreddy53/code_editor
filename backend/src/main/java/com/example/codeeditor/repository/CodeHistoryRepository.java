package com.example.codeeditor.repository;

import com.example.codeeditor.model.CodeHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeHistoryRepository
        extends JpaRepository<CodeHistory, Long> {
}