package com.playvu.backend.repository;



import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.playvu.backend.entity.FieldSchedule;

@Repository
public interface FieldScheduleRepository extends JpaRepository<FieldSchedule, Integer> {

    @Query(value = "SELECT COUNT(*) > 0 FROM field_schedule fs " +
               "WHERE fs.sub_field_id = :subFieldId " +
               "AND (:startDate >= fs.start_date AND :endDate <= fs.end_date)",
       nativeQuery = true)
    Boolean checkScheduleAvailability(@Param("subFieldId") Integer subFieldId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT fs.start_date AS \"startDate\", fs.end_date AS \"endDate\" FROM field_schedule fs WHERE fs.sub_field_id = :subFieldId", nativeQuery = true)
    List< Map<String, Object> > findBySubFieldId(@Param("subFieldId") Integer subFieldId);

    

}
    