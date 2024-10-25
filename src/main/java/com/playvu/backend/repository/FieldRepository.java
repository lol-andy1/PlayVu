package com.playvu.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.playvu.backend.entity.Field;

@Repository
public interface FieldRepository extends JpaRepository<Field, Integer> {
}
    