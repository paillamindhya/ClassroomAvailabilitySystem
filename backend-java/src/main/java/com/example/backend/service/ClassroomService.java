package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.entity.Classroom;
import com.example.backend.repository.ClassroomRepository;

@Service
public class ClassroomService {

    private final ClassroomRepository repository;

    public ClassroomService(ClassroomRepository repository) {
        this.repository = repository;
    }

    public List<Classroom> getAllClassrooms() {
        return repository.findAll();
    }

    public List<Classroom> getAvailableClassrooms(
            LocalDate date,
            LocalTime time,
            Integer capacity) {

        return repository.findAvailableClassrooms(date, time, capacity);
    }
}