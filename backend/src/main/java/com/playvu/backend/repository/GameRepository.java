package com.playvu.backend.repository;



import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    @Query(value = "SELECT g.game_id, g.name, g.start_date, " +
               "g.price, " +
               "sf.name AS sub_field_name, " +
               "mf.name AS master_field_name " +
               "FROM game g " +
               "JOIN sub_field sf ON g.sub_field_id = sf.sub_field_id " +
               "JOIN field mf ON sf.master_field_id = mf.field_id " +
               "WHERE g.game_id = :game_id", 
       nativeQuery = true)
    Map<String, Object> findByGameId(@Param("game_id") Integer game_id);

    @Query(value = "SELECT game_id AS \"gameId\", sub_field_id AS \"subFieldId\", organizer_id AS \"organizerId\", " +
               "name, start_date AS \"startDate\", end_date AS \"endDate\", price " +
               "FROM game WHERE sub_field_id = :subFieldId", nativeQuery = true)
    List< Map<String, Object> > findAllBySubFieldId(@Param("subFieldId") Integer subFieldId);

    @Query(value = "SELECT COUNT(*) = 0 FROM field_schedule fs " +
               "WHERE fs.sub_field_id = :subFieldId " +
               "AND NOT (:endDate <= fs.start_date OR :startDate >= fs.end_date)",
       nativeQuery = true)
    Boolean checkNoGameConflict(@Param("subFieldId") Integer subFieldId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
}
    