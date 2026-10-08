package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.FacultyAllocation;
import com.example.backend.repository.FacultyAllocationRepository;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyAllocationController {

    @Autowired
    private FacultyAllocationRepository repository;

    // Allocate room
    @PostMapping("/allocate")
    public FacultyAllocation allocateRoom(
            @RequestBody FacultyAllocation allocation) {

        return repository.save(allocation);
    }

    // Get allocations of a particular faculty
    @GetMapping("/{facultyId}/allocations")
    public List<FacultyAllocation> getFacultyAllocations(
            @PathVariable Long facultyId) {

        return repository.findByFacultyId(facultyId);
    }
}