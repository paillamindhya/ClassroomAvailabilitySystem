package com.example.backend.controller;

import com.example.backend.entity.Faculty;
import com.example.backend.repository.FacultyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/faculty")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class FacultyController {

    @Autowired
    private FacultyRepository facultyRepository;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Faculty loginData) {

        Map<String, String> response = new HashMap<>();

        Faculty faculty = facultyRepository.findByEmail(loginData.getEmail());

        if (faculty != null &&
            faculty.getPassword().equals(loginData.getPassword())) {

            response.put("message", "Login successful");
            response.put("email", faculty.getEmail());
            response.put("facultyId", faculty.getId().toString());

            return response;
        }

        response.put("message", "Invalid faculty email or password.");

        return response;
    }
}