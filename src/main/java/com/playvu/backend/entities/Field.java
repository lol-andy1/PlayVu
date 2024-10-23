package com.playvu.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "field")

public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer field_id;
    
}
