package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.FacultyAllocation;

public interface FacultyAllocationRepository
        extends JpaRepository<FacultyAllocation, Long> {

    List<FacultyAllocation> findByFacultyId(Long facultyId);
}