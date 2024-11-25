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

    @Query(value = "SELECT g.game_id, g.max_players, g.sub_field_id, g.organizer_id, g.name, g.start_date AT TIME ZONE 'UTC', g.end_date AT TIME ZONE 'UTC', f.picture, f.address AS \"location\", " +
                    "(SELECT COUNT(gp.participant_id) FROM game_participant gp WHERE gp.game_id = g.game_id) AS \"playerCount\" " +
                    "FROM game g " +
                    "JOIN sub_field sf ON g.sub_field_id = sf.sub_field_id " +
                    "JOIN field f ON sf.master_field_id = f.field_id " +
                    "WHERE f.field_id IN (:fieldIds)" + 
                    "AND g.start_date > CURRENT_TIMESTAMP AT TIME ZONE 'UTC'", 
            nativeQuery = true)
    List< Map<String, Object> > findByFieldIds(@Param("fieldIds") List<Integer> fieldIds);

    @Query(value = "SELECT g.game_id, g.max_players, g.sub_field_id, g.organizer_id, g.name, g.start_date AT TIME ZONE 'UTC', g.end_date AT TIME ZONE 'UTC', f.address AS \"location\" " +
               "FROM game g " +
               "JOIN sub_field sf ON g.sub_field_id = sf.sub_field_id " +
               "JOIN field f ON sf.master_field_id = f.field_id " +
               "JOIN game_participant gp ON g.game_id = gp.game_id " +
               "WHERE gp.participant_id = :participantId", 
       nativeQuery = true)
    List< Map<String, Object> > findByGameParticipant(@Param("participantId") Integer participantId);

    @Query(value = "SELECT g.game_id AS \"gameId\", g.max_players AS \"maxPlayers\", g.name, g.price, g.start_date AT TIME ZONE 'UTC' AS \"startDate\", g.end_date AT TIME ZONE 'UTC' AS \"endDate\" " +
               "FROM game g " +
               "WHERE g.organizer_id = :organizerId", 
       nativeQuery = true)
    List< Map<String, Object> > findByOrganizerId(@Param("organizerId") Integer organizerId);

    @Query(value = "SELECT g.game_id, g.max_players, g.name, g.start_date AT TIME ZONE 'UTC', g.end_date AT TIME ZONE 'UTC', g.price, mf.picture, mf.address AS \"location\", " +
               "(SELECT COUNT(gp.participant_id) FROM game_participant gp WHERE gp.game_id = g.game_id) AS \"playerCount\", " + 
               "sf.name AS sub_field_name, " +
               "mf.name AS master_field_name, " +
               "u.username AS \"organizerUsername\", " +
               "fo.username AS \"fieldOwnerUsername\" " +
               "FROM game g " +
               "JOIN sub_field sf ON g.sub_field_id = sf.sub_field_id " +
               "JOIN field mf ON sf.master_field_id = mf.field_id " +
               "JOIN users u ON g.organizer_id = u.user_id " +
               "JOIN users fo ON mf.owner_id = fo.user_id " +
               "WHERE g.game_id = :game_id", 
       nativeQuery = true)
    Map<String, Object> findByGameId(@Param("game_id") Integer game_id);

    @Query(value = "SELECT g.max_players \"maxPlayers\", g.name, g.price, CONCAT(mf.address, ', ', mf.city) AS \"location\", " +
               "(SELECT COUNT(gp.participant_id) FROM game_participant gp WHERE gp.game_id = g.game_id) AS \"playerCount\", " + 
               "u.email AS \"organizerEmail\", u.profile_picture AS \"organizerProfilePicture\" " + 
               "FROM game g " +
               "JOIN sub_field sf ON g.sub_field_id = sf.sub_field_id " +
               "JOIN users u ON g.organizer_id = u.user_id " +
               "JOIN field mf ON sf.master_field_id = mf.field_id " +
               "WHERE g.game_id = :game_id", 
       nativeQuery = true)
    Map<String, Object> ownerFindByGameId(@Param("game_id") Integer game_id);

    @Query(value = "SELECT game_id AS \"gameId\", sub_field_id AS \"subFieldId\", organizer_id AS \"organizerId\", " +
               "name, start_date AT TIME ZONE 'UTC' AS \"startDate\", end_date AT TIME ZONE 'UTC' AS \"endDate\", price " +
               "FROM game WHERE sub_field_id = :subFieldId", nativeQuery = true)
    List< Map<String, Object> > findAllBySubFieldId(@Param("subFieldId") Integer subFieldId);

    @Query(value = "SELECT COUNT(*) = 0 FROM game g " +
               "WHERE g.sub_field_id = :subFieldId " +
               "AND NOT (:endDate <= g.start_date OR :startDate >= g.end_date)",
       nativeQuery = true)
    Boolean checkNoGameConflict(@Param("subFieldId") Integer subFieldId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT CASE WHEN (SELECT COUNT(*) FROM game_participant gp WHERE gp.game_id = :gameId) >= g.max_players THEN true ELSE false END " +
               "FROM game g " +
               "WHERE g.game_id = :gameId", 
       nativeQuery = true)
       Boolean isGameFull(@Param("gameId") Integer gameId);

       @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END " +
                "FROM game g " +
                "WHERE g.sub_field_id = :subFieldId AND g.start_date > CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
        nativeQuery = true)
        boolean isPendingGame(@Param("subFieldId") Integer subFieldId);

        @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END " +
                "FROM game g " +
                "WHERE g.sub_field_id IN (:subFieldIds) AND g.start_date > CURRENT_TIMESTAMP AT TIME ZONE 'UTC'",
        nativeQuery = true)
        boolean isPendingGames(@Param("subFieldIds") List<Integer> subFieldIds);


    
}
    