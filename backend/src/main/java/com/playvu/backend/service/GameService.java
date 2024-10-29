package com.playvu.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.GameRepository;
// import com.playvu.backend.repository.SubFieldRepository;

@Service
public class GameService {
    @Autowired 
    private GameRepository game_repository;

    // @Autowired 
    // private SubFieldRepository sub_field_repository;

    @Autowired 
    private FieldRepository field_repository;


    public List< Map<String, Object> > get_games(float latitude, float longitude, float distance){

        List<Integer> nearest_fields = field_repository.findNearestFields(latitude, longitude, distance);
        List<Object[]> game_results = game_repository.findByFieldIds(nearest_fields);

        List<Map<String, Object>> game_list = new ArrayList<>();
        for (Object game[] : game_results) {
            Map<String, Object> gameMap = new HashMap<>();
            
            // Assuming the order in the query result is: game_id, sub_field_id, organizer_id, name, start_date, duration, location
            gameMap.put("game_id", game[0]);
            gameMap.put("sub_field_id", game[1]);
            gameMap.put("organizer_id", game[2]);
            gameMap.put("name", game[3]);
            gameMap.put("start_date", game[4]);
            gameMap.put("duration", game[5]);
            gameMap.put("location", game[6]); 

            game_list.add(gameMap);
        }

        return game_list;
    }
    
}
