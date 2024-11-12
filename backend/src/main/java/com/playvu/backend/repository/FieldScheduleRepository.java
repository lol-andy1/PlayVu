package com.playvu.backend.repository;



import java.time.LocalDateTime;

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

}
    