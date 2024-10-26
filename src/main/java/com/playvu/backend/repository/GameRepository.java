package com.playvu.backend.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.playvu.backend.entity.Game;


@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    @Query(value = "SELECT g.*, f.location FROM Game g " +
                   "JOIN SubField sf ON g.sub_field_id = sf.sub_field_id " +
                   "JOIN Field f ON sf.master_field_id = f.field_id " +
                   "WHERE g.sub_field_id = :sub_field_id", nativeQuery = true)
    List<Object> findBySubFieldId(Integer sub_field_id);
}
    