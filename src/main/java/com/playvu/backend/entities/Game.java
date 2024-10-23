package com.playvu.backend.entities;

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
    
}
