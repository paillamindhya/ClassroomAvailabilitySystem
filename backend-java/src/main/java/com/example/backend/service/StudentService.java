package com.example.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.entity.Student;
import com.example.backend.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public boolean login(String email, String password) {

        Optional<Student> student = repository.findByEmail(email);

        if (student.isPresent()) {
            return student.get().getPassword().equals(password);
        }

        return false;
    }
}