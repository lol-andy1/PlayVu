package com.playvu.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.playvu.backend.entity.SubField;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Repository
public interface SubFieldRepository extends JpaRepository<SubField, Integer> {

    @Query(value = "SELECT s.sub_field_id AS \"subFieldId\", s.name AS name " +
                   "FROM sub_field s WHERE s.master_field_id = :masterFieldId", nativeQuery = true)
    List< Map<String, Object> > findByMasterFieldId(@Param("masterFieldId") Integer masterFieldId);
}
    