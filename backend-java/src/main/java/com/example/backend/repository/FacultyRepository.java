package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Faculty;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Faculty findByEmail(String email);
}