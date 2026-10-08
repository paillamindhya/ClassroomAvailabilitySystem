package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Faculty;
import com.example.backend.repository.FacultyRepository;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public Faculty login(String email, String password) {

        Faculty faculty = facultyRepository.findByEmail(email);

        if (faculty != null && faculty.getPassword().equals(password)) {
            return faculty;
        }

        return null;
    }
}