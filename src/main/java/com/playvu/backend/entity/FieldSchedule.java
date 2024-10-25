package com.playvu.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "field_schedule")

public class FieldSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer field_schedule_id;

    @Column(nullable = false)
    private Integer sub_field_id;  

    @Column(nullable = false)
    private LocalDateTime start_date;

    @Column(nullable = false)
    private LocalDateTime end_date;
}
