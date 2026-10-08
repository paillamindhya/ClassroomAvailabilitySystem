package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173"
})
public class ClassroomController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/availability")
    public List<Map<String, Object>> getAvailableClassrooms(
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam Integer capacity) {

        String sql = """
            SELECT
                c.capacity,
                c.id,
                c.room_name
            FROM classrooms c
            WHERE c.capacity >= ?
              AND c.id NOT IN (
                  SELECT
                      t.room_id
                  FROM timetable t
                  WHERE
                      t.date = ?
                      AND ? >= t.start_time
                      AND ? < t.end_time
              )
            """;

        return jdbcTemplate.queryForList(
                sql,
                capacity,
                date,
                time,
                time
        );
    }
}