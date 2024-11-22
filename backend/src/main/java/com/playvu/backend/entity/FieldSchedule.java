package com.playvu.backend.entity;

import java.time.LocalDateTime;
import java.util.Optional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table()
public class FieldSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Integer fieldScheduleId;

    @Column(nullable = false)
    private Integer subFieldId;  

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    public Integer getFieldScheduleId() {
        return fieldScheduleId;
    }

    public void setFieldScheduleId(Integer fieldScheduleId) {
        this.fieldScheduleId = fieldScheduleId;
    }

    public Integer getSubFieldId() {
        return subFieldId;
    }

    public void setSubFieldId(Integer subFieldId) {
        this.subFieldId = subFieldId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Optional<Field> findById(Integer fieldScheduleId2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    @Override
    public String toString() {
        return "FieldSchedule [fieldScheduleId=" + fieldScheduleId + ", subFieldId=" + subFieldId + ", startDate="
                + startDate + ", endDate=" + endDate + "]";
    }

    

    
}
