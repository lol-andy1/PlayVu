package com.playvu.backend.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.playvu.backend.entity.Game;


@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    @Query(value = "SELECT g.game_id, g.sub_field_id, g.organizer_id, g.name, g.start_date, g.duration, f.address " +
                    "FROM game g " +
                    "JOIN sub_field sf ON g.sub_field_id = sf.sub_field_id " +
                    "JOIN field f ON sf.master_field_id = f.field_id " +
                    "WHERE f.field_id IN (:fieldIds)", 
            nativeQuery = true)
    List<Object[]> findByFieldIds(@Param("fieldIds") List<Integer> fieldIds);
}
    