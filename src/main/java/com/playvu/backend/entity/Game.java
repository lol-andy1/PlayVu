package com.playvu.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "game")

public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer game_id;

    @Column(nullable = false)
    private Integer sub_field_id;

    @Column(nullable = false)
    private Integer organizer_id;   

    @Column(nullable = false)
    private LocalDateTime start_date;

    @Column
    private LocalDateTime duration;
}