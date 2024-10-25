package com.playvu.backend.entity;

import jakarta.persistence.Column;
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

    @Column(nullable = false)
    private Integer owner_id;  

    @Column(nullable = false)
    private String location;  
    
}