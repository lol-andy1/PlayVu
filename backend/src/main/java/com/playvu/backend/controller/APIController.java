package com.playvu.backend.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.multipart.MultipartFile;

import com.playvu.backend.service.*;

import jakarta.servlet.http.HttpServletRequest;
import com.playvu.backend.entity.*;;

@RestController
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)
// Allow all origins for simplicity, change for production.
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

    @PostMapping(value = "/add-field")
    public Integer addField(HttpServletRequest request, @RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        return fieldService.addField(request, fieldBody.getName(), fieldBody.getDescription(), fieldBody.getPrice(), fieldBody.getPicture(), fieldBody.getAddress(), fieldBody.getZipCode(), fieldBody.getCity());
    }

    @PostMapping(value = "/edit-field")
    public void editField(HttpServletRequest request, @RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        fieldService.editField(request, fieldBody.getFieldId(), fieldBody.getName(), fieldBody.getDescription(), fieldBody.getPicture(), fieldBody.getAddress(), fieldBody.getZipCode(), fieldBody.getCity(), fieldBody.getPrice());
    }

    @PostMapping(value = "/delete-field")
    public void deleteSubField(@RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        fieldService.deleteField(fieldBody.getFieldId());
    }

    @PostMapping(value = "/add-subfield")
    public Integer addSubfield(HttpServletRequest request, @RequestBody SubField subfieldBody) throws URISyntaxException, IOException, InterruptedException {
        return subFieldService.addSubField(request, subfieldBody.getMasterFieldId(), subfieldBody.getName());
    }

    @PostMapping(value = "/delete-subfield")
    public void deleteSubField(HttpServletRequest request, @RequestBody SubField subfieldBody) throws URISyntaxException, IOException, InterruptedException {
        subFieldService.deleteSubField(request, subfieldBody.getSubFieldId());
    }

    @PostMapping(value = "/add-field-schedule")
    public void addFieldSchedule(HttpServletRequest request, @RequestBody FieldSchedule fieldScheduleBody) throws URISyntaxException, IOException, InterruptedException {
        fieldScheduleService.addFieldSchedule(request, fieldScheduleBody.getSubFieldId(), fieldScheduleBody.getStartDate(), fieldScheduleBody.getEndDate());
    }

    @PostMapping(value = "/edit-field-schedule")
    public void editFieldSchedule(HttpServletRequest request, @RequestBody FieldSchedule fieldScheduleBody) throws URISyntaxException, IOException, InterruptedException {
        fieldScheduleService.editFieldSchedule(request, fieldScheduleBody.getFieldScheduleId(), fieldScheduleBody.getStartDate(), fieldScheduleBody.getEndDate());
    }

    @PostMapping(value = "/delete-field-schedule")
    public void deleteFieldSchedule(HttpServletRequest request, @RequestBody FieldSchedule fieldScheduleBody) throws URISyntaxException, IOException, InterruptedException {
        fieldScheduleService.deleteFieldSchedule(request, fieldScheduleBody.getFieldScheduleId());
    }

    @GetMapping(value = "/get-fields-by-name")
    public Object getFieldsByName(@RequestParam String name) throws URISyntaxException, IOException, InterruptedException {
        return fieldService.getFieldsByName(name);
    }

    @GetMapping(value = "/get-games")
    public Object getGames(@RequestParam Float latitude, @RequestParam Float longitude, @RequestParam Float distance) {
        return gameService.getGames(latitude, longitude, distance);
    }

    @GetMapping(value = "/get-user-games")
    public Object getUserGames() {
        return gameService.getUserGames();
    }

    @GetMapping(value = "/get-organizer-games")
    public Object getOrganizerGames() {
        return gameService.getOrganizerGames();
    }

    @GetMapping(value = "/get-game-data")
    public Object getGameData(@RequestParam Integer gameId) {
        return gameService.getGameData(gameId);
    }

    @GetMapping(value = "/owner-get-game-data")
    public Map<String, Object> ownerGetGameData(@RequestParam Integer gameId) {
        return gameService.ownerGetGameData(gameId);
    }

    @GetMapping(value = "/get-owner-fields")
    public Object getOwnerFields(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException {
        return fieldService.getOwnerFields(request);
    }

    @GetMapping(value = "/get-field-schedules")
    public List<Map<String, Object>> getFieldSchedules(HttpServletRequest request, @RequestParam Integer fieldId) throws URISyntaxException, IOException, InterruptedException {
        return fieldService.getFieldSchedules(request, fieldId);
    }

    @GetMapping(value = "/get-subfield-schedules")
    public List<Map<String, Object>> getSubfieldSchedules(@RequestParam Integer subFieldId){
        return subFieldService.getSubFieldSchedules(subFieldId);
    }

    @PostMapping(value = "/add-game")
    public void addGame(HttpServletRequest request, @RequestBody Game gameBody) {
        gameService.addGame(gameBody.getSubFieldId(), gameBody.getName(), gameBody.getPrice(), gameBody.getMaxPlayers(), gameBody.getStartDate(), gameBody.getEndDate());
    }

    @PostMapping(value = "/delete-game")
    public void deleteGame(HttpServletRequest request, @RequestBody Game gameBody) {
        gameService.deleteGame(gameBody.getGameId());
    }

    @PostMapping(value = "/join-game")
    public void joinGame(HttpServletRequest request, @RequestBody GameParticipant gameParticipantBody) {
        gameService.joinGame(gameParticipantBody.getGameId(), gameParticipantBody.getTeam(), gameParticipantBody.getParticipantId(), gameParticipantBody.getPlayStart());
    }

    @PostMapping(value = "/switch-team")
    public void switchTeam(HttpServletRequest request, @RequestBody Game gameBody) {
        gameService.switchTeam(gameBody.getGameId());
    }

    @PostMapping(value = "/leave-game")
    public void leaveGame(@RequestBody Game gameBody) {
        gameService.leaveGame(gameBody.getGameId());
    }

    @PostMapping(value = "/remove-player")
    public void removePlayer(@RequestBody GameParticipant gameParticipantBody) {
        gameService.removePlayer(gameParticipantBody.getGameId(), gameParticipantBody.getParticipantId());
    }

    @PostMapping(value = "/switch-players")
    public void switchPlayers(@RequestBody Map<String, Integer> switchPlayersBody) {
        gameService.switchPlayers(switchPlayersBody.get("gameId"), switchPlayersBody.get("participantId1"), switchPlayersBody.get("participantId2"), switchPlayersBody.get("team"));
    }

    @GetMapping(value = "/get-user")
    public Map<String, Object> getUser(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException {
        return userService.getUser(request);
    }

    @GetMapping(value = "/get-users")
    public List < Map<String, Object> > getUsers() throws URISyntaxException, IOException, InterruptedException {
        return userService.getUsers();
    }

    @PostMapping(value = "/edit-user")
    public void editUser(@RequestBody Users userBody){
        userService.editUser(userBody.getFirstName(), userBody.getLastName(), userBody.getUsername(), userBody.getBio(), userBody.getProfilePicture());
    }

    @PostMapping(value = "/admin-edit-user")
    public void adminEditUser(@RequestBody Users userBody){
        userService.adminEditUser(userBody.getUserId(), userBody.getRole());
    }

    @PostMapping(value = "/admin-delete-user")
    public void adminDeleteUser(@RequestBody Users userBody){
        userService.adminDeleteUser(userBody.getUserId());
    }

    @PostMapping(value = "/find-username-of-field-owner")
    public String findUsernameOfFieldOwner(@RequestBody Map<String, Object> fieldName){
        return userService.findUsernameOfFieldOwner(fieldName);
    }  

}