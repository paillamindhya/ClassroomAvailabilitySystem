package com.example.backend.controller;

import com.example.backend.entity.Faculty;
import com.example.backend.repository.FacultyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/faculty")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://classroom-availability-frontend-mindhya.onrender.com"
})
public class FacultyController {

    @Autowired
    private FacultyRepository facultyRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody Faculty loginData) {

        Map<String, String> response = new HashMap<>();

        if (loginData.getEmail() == null ||
            loginData.getPassword() == null) {

            response.put("message", "Email and password are required.");

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }

        Faculty faculty =
                facultyRepository.findByEmail(loginData.getEmail().trim());

        if (faculty != null &&
            faculty.getPassword() != null &&
            faculty.getPassword().equals(loginData.getPassword())) {

            response.put("message", "Login successful");
            response.put("email", faculty.getEmail());
            response.put("facultyId", faculty.getId().toString());

            return ResponseEntity.ok(response);
        }

        response.put("message", "Invalid faculty email or password.");

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}
