package com.playvu.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.playvu.backend.entity.GameParticipant;

@Repository
public interface GameParticipantRepository extends JpaRepository<GameParticipant, Integer> {
    @Query(value = "SELECT gp.team , u.username, u.user_id " +
               "FROM game_participant gp " +
               "JOIN users u ON gp.participant_id = u.user_id " +
               "WHERE gp.game_id = :gameId", 
       nativeQuery = true)
    List<Object[]> gameParticipantsByGameId(@Param("gameId") Integer gameId);

    GameParticipant findByGameIdAndParticipantId(Integer gameId, Integer participantId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM game_participant " +
                "WHERE participant_id = :userId " +
                "AND game_id IN " +
                "(SELECT game_id FROM game WHERE start_date > CURRENT_TIMESTAMP)",
        nativeQuery = true)
    void deleteFutureUserGames(@Param("userId") Integer userId);

}
    