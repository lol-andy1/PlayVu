package com.playvu.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.playvu.backend.entity.Game;
import com.playvu.backend.entity.GameParticipant;
import com.playvu.backend.entity.Users;
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
    private GameParticipantRepository gameParticipantRepository;

    // @Autowired 
    // private SubFieldRepository sub_field_repository;

    @Autowired 
    private FieldRepository field_repository;

    @Autowired 
    private FieldScheduleRepository fieldScheduleRepository;

    @Autowired
    private UserService userService;


    public List< Map<String, Object> > getGames(float latitude, float longitude, float distance){

        List<Integer> nearest_fields = field_repository.getNearestFields(latitude, longitude, distance);
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

    public List< Map<String, Object> > getUserGames(){
        Users user = userService.getUserFromJwt();
        List< Map<String, Object> > userGames = gameRepository.findByGameParticipant(user.getUserId());
        return userGames;
    }

    public Object getGameData(Integer game_id) {
        List<Object[]> game_participants = gameParticipantRepository.gameParticipantsByGameId(game_id);
    
        List<Object> team1 = new ArrayList<>();
        List<Object> team2 = new ArrayList<>();
        List<Object> sideline = new ArrayList<>();
    
        for (Object[] participant : game_participants) {
    
            Integer team = (Integer) participant[0];
            String username = (String) participant[1];
            
            if(team == 0){
                sideline.add(username);
            }
            else if(team == 1){
                team1.add(username);
            }
            else{
                team2.add(username);
            }
        }
    
        Map<String, Object> game_data = new HashMap<>(gameRepository.findByGameId(game_id));
        
        game_data.put("team_1", team1);
        game_data.put("team_2", team2);
        game_data.put("sideline", sideline);
    
        return game_data;
    }

    public void addGame(Integer subFieldId, String name, LocalDateTime startDate, LocalDateTime endDate){
        if (subFieldId == null || name == null || startDate == null || endDate == null) {
            return;
        }
        if(startDate.isAfter(endDate)){
            return;
        }
        Users user = userService.getUserFromJwt();

        if( !(fieldScheduleRepository.checkScheduleAvailability(subFieldId, startDate, endDate) && gameRepository.checkNoGameConflict(subFieldId, startDate, endDate))){
            return;
        }
        Game newGame = new Game();
        newGame.setOrganizerId(user.getUserId());
        newGame.setSubFieldId(subFieldId);
        newGame.setName(name);
        newGame.setStartDate(startDate);
        newGame.setEndDate(endDate);

        gameRepository.save(newGame);
        
    }

    public void deleteGame(Integer gameId){
        Game game = gameRepository.findById(gameId).get();
        Users user = userService.getUserFromJwt();
        if(user.getUserId() != game.getOrganizerId()){
            return;
        }
        gameRepository.delete(game);
        
    }

    public void joinGame(Integer gameId, Integer team){
        gameRepository.findById(gameId).get(); // check if game is present 
        if(team != 1 && team != 2){
            return;
        }

        Users user = userService.getUserFromJwt();

        GameParticipant gameParticipant = new GameParticipant();
        gameParticipant.setGameId(gameId);
        gameParticipant.setParticipantId(user.getUserId());
        gameParticipant.setTeam(team);

        gameParticipantRepository.save(gameParticipant);
        
    }

    public void switchTeam(Integer gameId){
        gameRepository.findById(gameId).get(); // check if game is present 

        Users user = userService.getUserFromJwt();


        GameParticipant gameParticipant = gameParticipantRepository.findByGameIdAndParticipantId(gameId, user.getUserId());
        Integer currentTeam = gameParticipant.getTeam();
        
        if(currentTeam == 1){
            gameParticipant.setTeam(2);
        }
        else{
            gameParticipant.setTeam(1);
        }

        gameParticipantRepository.save(gameParticipant);
        
    }


}
