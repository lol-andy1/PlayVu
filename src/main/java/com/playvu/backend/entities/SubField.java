package com.playvu.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sub_field")
public class SubField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sub_field_id;
    
}
