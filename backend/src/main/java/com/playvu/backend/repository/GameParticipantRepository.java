package com.playvu.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.playvu.backend.entity.GameParticipant;

@Repository
public interface GameParticipantRepository extends JpaRepository<GameParticipant, Integer> {
    @Query(value = "SELECT gp.team , u.username " +
               "FROM game_participant gp " +
               "JOIN users u ON gp.participant_id = u.user_id " +
               "WHERE gp.game_id = :game_id", 
       nativeQuery = true)
    List<Object[]> game_participants_by_game_id(@Param("game_id") Integer game_id);
}
    