package com.playvu.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.playvu.backend.entity.SubField;

@Repository
public interface SubFieldRepository extends JpaRepository<SubField, Integer> {
}
    