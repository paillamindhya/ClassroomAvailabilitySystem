package com.example.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.entity.Classroom;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

    @Query(value = """
            SELECT c.*
            FROM classrooms c
            WHERE c.capacity >= :capacity
            AND c.id NOT IN (
                SELECT t.room_id
                FROM timetable t
                WHERE t.date = :date
                AND :time >= t.start_time
                AND :time < t.end_time
            )
            """, nativeQuery = true)
    List<Classroom> findAvailableClassrooms(
            @Param("date") LocalDate date,
            @Param("time") LocalTime time,
            @Param("capacity") Integer capacity
    );
}