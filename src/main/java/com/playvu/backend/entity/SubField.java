package com.playvu.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table()
public class SubField {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Integer subFieldId;

    @Column(nullable = false)
    private Integer masterFieldId;

    public Integer getSubFieldId() {
        return subFieldId;
    }

    public void setSubFieldId(Integer subFieldId) {
        this.subFieldId = subFieldId;
    }

    public Integer getMasterFieldId() {
        return masterFieldId;
    }

    public void setMasterFieldId(Integer masterFieldId) {
        this.masterFieldId = masterFieldId;
    }
    
    
}
