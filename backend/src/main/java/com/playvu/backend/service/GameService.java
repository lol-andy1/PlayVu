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
import com.playvu.backend.repository.UsersRepository;

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
    private UsersRepository usersRepository;

    @Autowired
    private UserService userService;


    /**
     * Retrieves games within a specified distance of the given coordinates.
     * 
     * @param latitude  the latitude of the search location
     * @param longitude the longitude of the search location
     * @param distance  the maximum distance from the location to search for games
     * @return a list of games near the specified coordinates
     */
    public List<Map<String, Object>> getGames(float latitude, float longitude, float distance) {
        List<Integer> nearest_fields = fieldRepository.getNearestFields(latitude, longitude, distance);
        return gameRepository.findByFieldIds(nearest_fields);
    }

    /**
     * Retrieves all games that the current user is participating in.
     * 
     * @return a list of games the user is participating in
     */
    public List<Map<String, Object>> getUserGames() {
        Users user = userService.getUserFromJwt();
        return gameRepository.findByGameParticipant(user.getUserId());
    }

    /**
     * Retrieves all games organized by the current user.
     * 
     * @return a list of games organized by the user
     */
    public List<Map<String, Object>> getOrganizerGames() {
        Users user = userService.getUserFromJwt();
        return gameRepository.findByOrganizerId(user.getUserId());
    }

    /**
     * Retrieves detailed data about a specific game, including participant information.
     * 
     * @param game_id the ID of the game to retrieve
     * @return a map containing game data, including team and sideline participants
     */
    public Object getGameData(Integer game_id) {
        List<Object[]> game_participants = gameParticipantRepository.gameParticipantsByGameId(game_id);
        List<Object> team1 = new ArrayList<>();
        List<Object> team2 = new ArrayList<>();
        List<Object> sideline = new ArrayList<>();

        for (Object[] participant : game_participants) {
            Integer team = (Integer) participant[0];
            String username = (String) participant[1];
            if (team == 0) {
                sideline.add(username);
            } else if (team == 1) {
                team1.add(username);
            } else {
                team2.add(username);
            }
        }

        Map<String, Object> game_data = new HashMap<>(gameRepository.findByGameId(game_id));
        game_data.put("team_1", team1);
        game_data.put("team_2", team2);
        game_data.put("sideline", sideline);

        return game_data;
    }

    /**
     * Retrieves game data for a game associated with a field owned by the current user.
     * 
     * @param gameId the ID of the game to retrieve
     * @return a map containing game data if the user owns the associated field
     * @throws ResponseStatusException if the user does not control the subfield of the specified game
     */
    public Map<String, Object> ownerGetGameData(Integer gameId) {
        Users user = userService.getUserFromJwt();
        Integer subFieldId = gameRepository.findById(gameId).get().getSubFieldId();
        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if (fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control subfield of specified game.");
        }
        return gameRepository.ownerFindByGameId(gameId);
    }

    /**
     * Adds a new game to the system.
     * 
     * @param subFieldId the ID of the subfield where the game will be held
     * @param name       the name of the game
     * @param price      the price of the game (optional, defaults to 0.0 if null)
     * @param maxPlayers the maximum number of players allowed in the game
     * @param startDate  the start time of the game
     * @param endDate    the end time of the game
     */
    public void addGame(Integer subFieldId, String name, Float price, Integer maxPlayers, LocalDateTime startDate, LocalDateTime endDate){
        if (subFieldId == null || name == null || startDate == null || endDate == null) {
            return;
        }
        if(startDate.isAfter(endDate)){
            return;
        }
        Users user = userService.getUserFromJwt();

        if( !fieldScheduleRepository.checkScheduleAvailability(subFieldId, startDate, endDate)){
            System.out.println("No availability found for dates: " + startDate + ", " + endDate + "for subfield: " + subFieldId);
            return;
        }
        if( !gameRepository.checkNoGameConflict(subFieldId, startDate, endDate)){
            System.out.println("Game conflict for dates: " + startDate + ", " + endDate + "for subfield: " + subFieldId);
            return;
        }
        
        Game newGame = new Game();
        newGame.setOrganizerId(user.getUserId());
        newGame.setSubFieldId(subFieldId);
        newGame.setName(name);
        newGame.setStartDate(startDate);
        newGame.setEndDate(endDate);
        newGame.setMaxPlayers(maxPlayers);

        if(price == null){
            newGame.setPrice(0.f);
        }
        else{
            newGame.setPrice(price);
        }

        gameRepository.save(newGame);
        
    }

    /**
     * Deletes a game organized by the current user.
     * 
     * @param gameId the ID of the game to delete
     */
    public void deleteGame(Integer gameId) {
        Game game = gameRepository.findById(gameId).get();
        Users user = userService.getUserFromJwt();
        if (user.getUserId() != game.getOrganizerId()) {
            return;
        }
        gameRepository.delete(game);
    }

    /**
     * Allows the current user to join a game on a specific team.
     * 
     * @param gameId the ID of the game to join
     * @param team   the team to join (0 for sideline, 1 for team 1, 2 for team 2)
     */
    public void joinGame(Integer gameId, Integer team) {
        gameRepository.findById(gameId).get(); // Ensure the game exists
        if (team != 0 && team != 1 && team != 2) {
            return;
        }
        if (gameRepository.isGameFull(gameId)) {
            System.out.println("Game with ID " + gameId + " is full.");
            return;
        }

        Users user = userService.getUserFromJwt();

        if (gameParticipantRepository.findByGameIdAndParticipantId(gameId, user.getUserId()) != null) {
            System.out.println("User with ID " + user.getUserId() + " has already joined the game with ID " + gameId);
            return;
        }

        GameParticipant gameParticipant = new GameParticipant();
        gameParticipant.setGameId(gameId);
        gameParticipant.setParticipantId(user.getUserId());
        gameParticipant.setTeam(team);

        gameParticipantRepository.save(gameParticipant);
    }

    /**
     * Allows the current user to switch their team in a game.
     * 
     * @param gameId the ID of the game to switch teams in
     */
    public void switchTeam(Integer gameId) {
        gameRepository.findById(gameId).get(); // Ensure the game exists

        Users user = userService.getUserFromJwt();
        GameParticipant gameParticipant = gameParticipantRepository.findByGameIdAndParticipantId(gameId, user.getUserId());
        Integer currentTeam = gameParticipant.getTeam();

        if (currentTeam == 1) {
            gameParticipant.setTeam(2);
        } else {
            gameParticipant.setTeam(1);
        }

        gameParticipantRepository.save(gameParticipant);
    }

    /**
     * Allows the current user to leave a game they are participating in.
     * 
     * @param gameId the ID of the game to leave
     */
    public void leaveGame(Integer gameId) {
        gameRepository.findById(gameId).get(); // Ensure the game exists

        Users user = userService.getUserFromJwt();
        GameParticipant gameParticipant = gameParticipantRepository.findByGameIdAndParticipantId(gameId, user.getUserId());
        gameParticipantRepository.delete(gameParticipant);
    }

    /**
     * Removes a specified participant from a game organized by the current user.
     * 
     * @param gameId       the ID of the game
     * @param participantId the ID of the participant to remove
     * @throws ResponseStatusException if the current user is not the organizer of the game
     */
    public void removePlayer(Integer gameId, Integer participantId) {
        Game game = gameRepository.findById(gameId).get(); // Ensure the game exists

        Users user = userService.getUserFromJwt();
        Users participant = usersRepository.findById(participantId).get();

        if (game.getOrganizerId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control game: " + gameId);
        }

        GameParticipant gameParticipant = gameParticipantRepository.findByGameIdAndParticipantId(gameId, participant.getUserId());
        gameParticipantRepository.delete(gameParticipant);
    }

    /**
     * Switches the teams of two participants in a game organized by the current user.
     * 
     * @param gameId        the ID of the game
     * @param participantId1 the ID of the first participant
     * @param participantId2 the ID of the second participant
     * @param team          the team to assign the second participant
     * @throws ResponseStatusException if the current user is not the organizer of the game
     */
    public void switchPlayers(Integer gameId, Integer participantId1, Integer participantId2, Integer team) {
        Game game = gameRepository.findById(gameId).get(); // Ensure the game exists

        Users user = userService.getUserFromJwt();
        Users participant1 = usersRepository.findById(participantId1).get();
        Users participant2 = usersRepository.findById(participantId2).get();

        if (game.getOrganizerId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control game: " + gameId);
        }

        GameParticipant gameParticipant1 = gameParticipantRepository.findByGameIdAndParticipantId(gameId, participant1.getUserId());
        GameParticipant gameParticipant2 = gameParticipantRepository.findByGameIdAndParticipantId(gameId, participant2.getUserId());

        gameParticipant1.setTeam(0);
        gameParticipant2.setTeam(team);

        gameParticipantRepository.save(gameParticipant1);
        gameParticipantRepository.save(gameParticipant2);
    }



}
