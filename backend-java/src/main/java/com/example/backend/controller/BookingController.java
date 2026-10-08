package com.example.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class BookingController {

    private final JdbcTemplate jdbcTemplate;

    public BookingController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/booking")
    public ResponseEntity<?> bookClassroom(
            @RequestBody Map<String, String> booking) {

        try {

            String roomId = booking.get("room_id");
            String subject = booking.get("subject");
            String date = booking.get("date");
            String startTime = booking.get("start_time");
            String endTime = booking.get("end_time");

            String sql = """
                    INSERT INTO timetable
                    (room_id, subject, date, start_time, end_time)
                    VALUES (?, ?, ?, ?, ?)
                    """;

            jdbcTemplate.update(
                    sql,
                    Integer.parseInt(roomId),
                    subject,
                    date,
                    startTime,
                    endTime
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Classroom booked successfully",
                            "room_id", roomId,
                            "subject", subject,
                            "date", date,
                            "start_time", startTime,
                            "end_time", endTime
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message", "Booking failed",
                            "error", e.getMessage()
                    )
            );
        }
    }
}