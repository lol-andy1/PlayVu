package com.playvu.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.playvu.backend.entity.Game;
import com.playvu.backend.entity.GameParticipant;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
import com.playvu.backend.repository.GameParticipantRepository;
import com.playvu.backend.repository.GameRepository;
// import com.playvu.backend.repository.SubFieldRepository;
import com.playvu.backend.repository.SubFieldRepository;

@Service
public class GameService {
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameParticipantRepository gameParticipantRepository;

    @Autowired
    private SubFieldRepository subFieldRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private FieldScheduleRepository fieldScheduleRepository;

    @Autowired
    private UserService userService;

    public List<Map<String, Object>> getGames(float latitude, float longitude, float distance) {

        List<Integer> nearest_fields = fieldRepository.getNearestFields(latitude, longitude, distance);
        return gameRepository.findByFieldIds(nearest_fields);
    }

    public List<Map<String, Object>> getUserGames() {
        Users user = userService.getUserFromJwt();
        List<Map<String, Object>> userGames = gameRepository.findByGameParticipant(user.getUserId());
        return userGames;
    }

    public List<Map<String, Object>> getOrganizerGames() {
        Users user = userService.getUserFromJwt();
        List<Map<String, Object>> organizerGames = gameRepository.findByOrganizerId(user.getUserId());
        return organizerGames;
    }

    public Object getGameData(Integer game_id) {
        List<Object[]> game_participants = gameParticipantRepository.gameParticipantsByGameId(game_id);

        List<Map<String, Object>> team1 = new ArrayList<>();
        List<Map<String, Object>> team2 = new ArrayList<>();
        List<Map<String, Object>> sideline = new ArrayList<>();

        for (Object[] participant : game_participants) {

            Integer team = (Integer) participant[0];
            String username = (String) participant[1];
            Integer userId = (Integer) participant[2];

            Map<String, Object> entry = new HashMap<>();
            entry.put("username", username);
            entry.put("userId", userId);

            if (team == 0) {
                sideline.add(entry);
            } else if (team == 1) {
                team1.add(entry);
            } else {
                team2.add(entry);
            }
        }

        Map<String, Object> game_data = new HashMap<>(gameRepository.findByGameId(game_id));

        game_data.put("team_1", team1);
        game_data.put("team_2", team2);
        game_data.put("sideline", sideline);

        return game_data;
    }

    public Map<String, Object> ownerGetGameData(Integer gameId) {
        Users user = userService.getUserFromJwt();

        Integer subFieldId = gameRepository.findById(gameId).get().getSubFieldId();
        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if (fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "User does not control subfield of specified game.");
        }
        return gameRepository.ownerFindByGameId(gameId);

    }

    public void addGame(Integer subFieldId, String name, Float price, Integer maxPlayers, LocalDateTime startDate,
            LocalDateTime endDate) {
        if (subFieldId == null || name == null || startDate == null || endDate == null) {
            return;
        }
        if (startDate.isAfter(endDate)) {
            return;
        }
        Users user = userService.getUserFromJwt();

        if (!fieldScheduleRepository.checkScheduleAvailability(subFieldId, startDate, endDate)) {
            System.out.println(
                    "No availability found for dates: " + startDate + ", " + endDate + "for subfield: " + subFieldId);
            return;
        }
        if (!gameRepository.checkNoGameConflict(subFieldId, startDate, endDate)) {
            System.out
                    .println("Game conflict for dates: " + startDate + ", " + endDate + "for subfield: " + subFieldId);
            return;
        }

        Game newGame = new Game();
        newGame.setOrganizerId(user.getUserId());
        newGame.setSubFieldId(subFieldId);
        newGame.setName(name);
        newGame.setStartDate(startDate);
        newGame.setEndDate(endDate);
        newGame.setMaxPlayers(maxPlayers);

        if (price == null) {
            newGame.setPrice(0.f);
        } else {
            newGame.setPrice(price);
        }

        gameRepository.save(newGame);

    }

    public void deleteGame(Integer gameId) {
        Game game = gameRepository.findById(gameId).get();
        Users user = userService.getUserFromJwt();
        if (user.getUserId() != game.getOrganizerId()) {
            return;
        }
        gameRepository.delete(game);

    }

    public void joinGame(Integer gameId, Integer team, Integer participantId) {
        Game game = gameRepository.findById(gameId).get(); // check if game is present
        if (team != 0 && team != 1 && team != 2) {
            return;
        }
        if (gameRepository.isGameFull(gameId)) {
            System.out.println("Game with ID " + gameId + " is full.");
            return;
        }

        Users user = userService.getUserFromJwt();
        Integer userId = user.getUserId();
        
        if (participantId != null && userId == game.getOrganizerId()){
            userId = participantId;
        }
        
        if (gameParticipantRepository.findByGameIdAndParticipantId(gameId, userId) != null) {
            GameParticipant gameParticipant = gameParticipantRepository.findByGameIdAndParticipantId(gameId, userId);
            gameParticipant.setTeam(team);

            gameParticipantRepository.save(gameParticipant);
        } else {
            GameParticipant gameParticipant = new GameParticipant();
            gameParticipant.setGameId(gameId);
            gameParticipant.setParticipantId(userId);
            gameParticipant.setTeam(team);

            gameParticipantRepository.save(gameParticipant);
        }

    }

    public void switchTeam(Integer gameId) {
        gameRepository.findById(gameId).get(); // check if game is present

        Users user = userService.getUserFromJwt();

        GameParticipant gameParticipant = gameParticipantRepository.findByGameIdAndParticipantId(gameId,
                user.getUserId());
        Integer currentTeam = gameParticipant.getTeam();

        if (currentTeam == 1) {
            gameParticipant.setTeam(2);
        } else {
            gameParticipant.setTeam(1);
        }

        gameParticipantRepository.save(gameParticipant);

    }

    public void leaveGame(Integer gameId) {
        gameRepository.findById(gameId).get(); // check if game is present

        Users user = userService.getUserFromJwt();

        GameParticipant gameParticipant = gameParticipantRepository.findByGameIdAndParticipantId(gameId,
                user.getUserId());
        gameParticipantRepository.delete(gameParticipant);

    }

}
