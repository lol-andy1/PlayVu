package com.playvu.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.playvu.backend.entity.Game;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
import com.playvu.backend.repository.GameParticipantRepository;
import com.playvu.backend.repository.GameRepository;
// import com.playvu.backend.repository.SubFieldRepository;

@Service
public class GameService {
    @Autowired 
    private GameRepository gameRepository;

    @Autowired 
    private GameParticipantRepository game_participant_repository;

    // @Autowired 
    // private SubFieldRepository sub_field_repository;

    @Autowired 
    private FieldRepository field_repository;

    @Autowired 
    private FieldScheduleRepository fieldScheduleRepository;


    public List< Map<String, Object> > get_games(float latitude, float longitude, float distance){

        List<Integer> nearest_fields = field_repository.findNearestFields(latitude, longitude, distance);
        List<Object[]> game_results = gameRepository.findByFieldIds(nearest_fields);

        List<Map<String, Object>> game_list = new ArrayList<>();
        for (Object game[] : game_results) {
            Map<String, Object> game_map = new HashMap<>();
            
            // Assuming the order in the query result is: game_id, sub_field_id, organizer_id, name, start_date, duration, location
            game_map.put("game_id", game[0]);
            game_map.put("sub_field_id", game[1]);
            game_map.put("organizer_id", game[2]);
            game_map.put("name", game[3]);
            game_map.put("start_date", game[4]);
            game_map.put("duration", game[5]);
            game_map.put("location", game[6]); 

            game_list.add(game_map);
        }

        return game_list;
    }

    public Object get_game_data(Integer game_id) {
        List<Object[]> game_participants = game_participant_repository.gameParticipantsByGameId(game_id);
    
        List<Object> team_1 = new ArrayList<>();
        List<Object> team_2 = new ArrayList<>();
    
        for (Object[] participant : game_participants) {
    
            Integer team = (Integer) participant[0];
            String username = (String) participant[1];
    
            (team == 1 ? team_1 : team_2).add(username);
        }
    
        Map<String, Object> game_data = new HashMap<>(gameRepository.findByGameId(game_id));
        
        game_data.put("team_1", team_1);
        game_data.put("team_2", team_2);
    
        return game_data;
    }

    public void addGame(Integer subFieldId, String name, LocalDateTime startDate, LocalDateTime endDate){
        if (subFieldId == null || name == null || startDate == null || endDate == null) {
            return;
        }
        if(startDate.isAfter(endDate)){
            return;
        }

        System.out.println(fieldScheduleRepository.checkScheduleAvailability(subFieldId, startDate, endDate));
        System.out.println(gameRepository.checkNoGameConflict(subFieldId, startDate, endDate));
        if( !(fieldScheduleRepository.checkScheduleAvailability(subFieldId, startDate, endDate) && gameRepository.checkNoGameConflict(subFieldId, startDate, endDate))){
            return;
        }
        Game newGame = new Game();
        newGame.setSubFieldId(subFieldId);
        newGame.setName(name);
        newGame.setStartDate(startDate);
        newGame.setEndDate(endDate);

        gameRepository.save(newGame);
        
    }
}
