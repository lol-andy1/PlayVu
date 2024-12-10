package com.playvu.backend.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.playvu.backend.service.*;

import com.playvu.backend.entity.*;

@RestController
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "*")
public class APIController {

    @Autowired
    private UserService userService;

    @Autowired
    private GameService gameService;

    @Autowired
    private FieldService fieldService;

    @Autowired
    private SubFieldService subFieldService;

    @Autowired
    private FieldScheduleService fieldScheduleService;

    /**
     * Adds a new field.
     * 
     * @param fieldBody The details of the field to be added.
     * @return The ID of the newly added field.
     */
    @PostMapping(value = "/add-field")
    public Integer addField(@RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        if (fieldBody.getName() == null || fieldBody.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Field name is required.");
        }
        return fieldService.addField(fieldBody.getName(), fieldBody.getDescription(), fieldBody.getPrice(), fieldBody.getPicture(), fieldBody.getAddress(), fieldBody.getZipCode(), fieldBody.getCity());
    }

    /**
     * Edits an existing field.
     * 
     * @param fieldBody The updated field details.
     */
    @PostMapping(value = "/edit-field")
    public void editField(@RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        fieldService.editField(fieldBody.getFieldId(), fieldBody.getName(), fieldBody.getDescription(), fieldBody.getPrice(), fieldBody.getPicture(), fieldBody.getAddress(), fieldBody.getZipCode(), fieldBody.getCity());
    }

    /**
     * Deletes a field.
     * 
     * @param fieldBody The details of the field to be deleted.
     */
    @PostMapping(value = "/delete-field")
    public void deleteField(@RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        fieldService.deleteField(fieldBody.getFieldId());
    }

    /**
     * Adds a new subfield to a master field.
     * 
     * @param subfieldBody  The details of the subfield to be added.
     * @return The ID of the newly added subfield.
     */
    @PostMapping(value = "/add-subfield")
    public Integer addSubfield(@RequestBody SubField subfieldBody) throws URISyntaxException, IOException, InterruptedException {
        return subFieldService.addSubField(subfieldBody.getMasterFieldId(), subfieldBody.getName());
    }

    /**
     * Deletes a subfield.
     * 
     * @param subfieldBody  The details of the subfield to be deleted.
     */
    @PostMapping(value = "/delete-subfield")
    public void deleteSubField(@RequestBody SubField subfieldBody) throws URISyntaxException, IOException, InterruptedException {
        subFieldService.deleteSubField(subfieldBody.getSubFieldId());
    }

    /**
     * Adds a schedule to a field.
     * 
     * @param fieldScheduleBody   The details of the schedule to be added.
     */
    @PostMapping(value = "/add-field-schedule")
    public void addFieldSchedule(@RequestBody FieldSchedule fieldScheduleBody) throws URISyntaxException, IOException, InterruptedException {
        fieldScheduleService.addFieldSchedule(fieldScheduleBody.getSubFieldId(), fieldScheduleBody.getStartDate(), fieldScheduleBody.getEndDate());
    }

    /**
     * Edits an existing field schedule.
     * 
     * @param fieldScheduleBody   The updated schedule details.
     */
    @PostMapping(value = "/edit-field-schedule")
    public void editFieldSchedule(@RequestBody FieldSchedule fieldScheduleBody) throws URISyntaxException, IOException, InterruptedException {
        fieldScheduleService.editFieldSchedule(fieldScheduleBody.getFieldScheduleId(), fieldScheduleBody.getStartDate(), fieldScheduleBody.getEndDate());
    }

    /**
     * Deletes a field schedule.
     * 
     * @param fieldScheduleBody   The details of the schedule to be deleted.
     */
    @PostMapping(value = "/delete-field-schedule")
    public void deleteFieldSchedule(@RequestBody FieldSchedule fieldScheduleBody) throws URISyntaxException, IOException, InterruptedException {
        fieldScheduleService.deleteFieldSchedule(fieldScheduleBody.getFieldScheduleId());
    }

    /**
     * Retrieves a list of games near the specified geographic coordinates.
     * 
     * @param latitude The latitude of the user's location.
     * @param longitude The longitude of the user's location.
     * @param distance The radius within which to search for games (in miles).
     * @return A list of games within the specified distance from the location.
     */
    @GetMapping(value = "/get-games")
    public Object getGames(@RequestParam Float latitude, @RequestParam Float longitude, @RequestParam Float distance) {
        return gameService.getGames(latitude, longitude, distance);
    }

    /**
     * Retrieves a list of games the current user has joined.
     * 
     * @return A list of games associated with the user.
     */
    @GetMapping(value = "/get-user-games")
    public Object getUserGames() {
        return gameService.getUserGames();
    }

    /**
     * Retrieves a list of games the current user is organizing.
     * 
     * @return A list of games organized by the user.
     */
    @GetMapping(value = "/get-organizer-games")
    public Object getOrganizerGames() {
        return gameService.getOrganizerGames();
    }

    /**
     * Retrieves detailed data for a specific game.
     * 
     * @param gameId The ID of the game to retrieve data for.
     * @return Detailed game data including participants and schedules.
     */
    @GetMapping(value = "/get-game-data")
    public Object getGameData(@RequestParam Integer gameId) {
        return gameService.getGameData(gameId);
    }

    /**
     * Retrieves game data for a specific game, including details specific to the owner.
     * 
     * @param gameId The ID of the game to retrieve data for.
     * @return A map of game data visible to the field owner.
     */
    @GetMapping(value = "/owner-get-game-data")
    public Map<String, Object> ownerGetGameData(@RequestParam Integer gameId) {
        return gameService.ownerGetGameData(gameId);
    }

    /**
     * Retrieves the fields owned by the current user.
     * 
     * @return A list of fields owned by the user.
     * @throws URISyntaxException
     * @throws IOException
     * @throws InterruptedException
     */
    @GetMapping(value = "/get-owner-fields")
    public Object getOwnerFields() throws URISyntaxException, IOException, InterruptedException {
        return fieldService.getOwnerFields();
    }

    /**
     * Retrieves the schedules for a specific field.
     * 
     * @param fieldId The ID of the field to retrieve schedules for.
     * @return A list of schedules for the specified field.
     * @throws URISyntaxException
     * @throws IOException
     * @throws InterruptedException
     */
    @GetMapping(value = "/get-field-schedules")
    public List<Map<String, Object>> getFieldSchedules(@RequestParam Integer fieldId) throws URISyntaxException, IOException, InterruptedException {
        return fieldService.getFieldSchedules(fieldId);
    }

    /**
     * Retrieves the schedules for a specific subfield.
     * 
     * @param subFieldId The ID of the subfield to retrieve schedules for.
     * @return A list of schedules for the specified subfield.
     */
    @GetMapping(value = "/get-subfield-schedules")
    public List<Map<String, Object>> getSubfieldSchedules(@RequestParam Integer subFieldId) {
        return subFieldService.getSubFieldSchedules(subFieldId);
    }

    /**
     * Adds a new game.
     * 
     * @param gameBody The game object containing game details.
     */
    @PostMapping(value = "/add-game")
    public void addGame(@RequestBody Game gameBody) {
        gameService.addGame(gameBody.getSubFieldId(), gameBody.getName(), gameBody.getPrice(), gameBody.getMaxPlayers(), gameBody.getStartDate(), gameBody.getEndDate());
    }

    /**
     * Deletes a game.
     * 
     * @param gameBody The game object containing the ID of the game to delete.
     */
    @PostMapping(value = "/delete-game")
    public void deleteGame(@RequestBody Game gameBody) {
        gameService.deleteGame(gameBody.getGameId());
    }

    /**
     * Allows a user to join a game.
     * 
     * @param gameParticipantBody The object containing the game ID and team information.
     */
    @PostMapping(value = "/join-game")
    public void joinGame(@RequestBody GameParticipant gameParticipantBody) {
        gameService.joinGame(gameParticipantBody.getGameId(), gameParticipantBody.getTeam());
    }

    /**
     * Switches the team for a user in a game.
     * 
     * @param gameBody The game object containing the game ID.
     */
    @PostMapping(value = "/switch-team")
    public void switchTeam(@RequestBody Game gameBody) {
        gameService.switchTeam(gameBody.getGameId());
    }

    /**
     * Allows a user to leave a game.
     * 
     * @param gameBody The game object containing the ID of the game to leave.
     */
    @PostMapping(value = "/leave-game")
    public void leaveGame(@RequestBody Game gameBody) {
        gameService.leaveGame(gameBody.getGameId());
    }

    /**
     * Removes a participant from a game.
     * 
     * @param gameParticipantBody The object containing game ID and participant ID.
     */
    @PostMapping(value = "/remove-player")
    public void removePlayer(@RequestBody GameParticipant gameParticipantBody) {
        gameService.removePlayer(gameParticipantBody.getGameId(), gameParticipantBody.getParticipantId());
    }

    /**
     * Switches two players between teams in a game.
     * 
     * @param switchPlayersBody A map containing game ID, participant IDs, and team information.
     */
    @PostMapping(value = "/switch-players")
    public void switchPlayers(@RequestBody Map<String, Integer> switchPlayersBody) {
        gameService.switchPlayers(switchPlayersBody.get("gameId"), switchPlayersBody.get("participantId1"), switchPlayersBody.get("participantId2"), switchPlayersBody.get("team"));
    }

    /**
     * Retrieves user details for the current user.
     * 
     * @return A map containing user details.
     * @throws URISyntaxException
     * @throws IOException
     * @throws InterruptedException
     */
    @GetMapping(value = "/get-user")
    public Map<String, Object> getUser() throws URISyntaxException, IOException, InterruptedException {
        return userService.getUser();
    }

    /**
     * Retrieves a list of all users.
     * 
     * @return A list of user details.
     * @throws URISyntaxException
     * @throws IOException
     * @throws InterruptedException
     */
    @GetMapping(value = "/get-users")
    public List<Map<String, Object>> getUsers() throws URISyntaxException, IOException, InterruptedException {
        return userService.getUsers();
    }

    /**
     * Edits the current user's profile.
     * 
     * @param userBody The user object containing updated user details.
     */
    @PostMapping(value = "/edit-user")
    public void editUser(@RequestBody Users userBody) {
        userService.editUser(userBody.getFirstName(), userBody.getLastName(), userBody.getUsername(), userBody.getBio(), userBody.getProfilePicture());
    }

    /**
     * Allows an admin to edit a user's role.
     * 
     * @param userBody The user object containing the user ID and new role.
     */
    @PostMapping(value = "/admin-edit-user")
    public void adminEditUser(@RequestBody Users userBody) {
        userService.adminEditUser(userBody.getUserId(), userBody.getRole());
    }

    /**
     * Allows an admin to delete a user.
     * 
     * @param userBody The user object containing the user ID of the user to delete.
     */
    @PostMapping(value = "/admin-delete-user")
    public void adminDeleteUser(@RequestBody Users userBody) {
        userService.adminDeleteUser(userBody.getUserId());
    }
    

}