package com.playvu.backend.controller;

import java.io.IOException;
import java.net.URISyntaxException;
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


    @GetMapping(value = "/public")
    public String publicEndpoint() {
        return "No authentication required.";
    }

    @GetMapping(value = "/private")
    public Message privateEndpoint() {
        return new Message("All good. You can see this because you are Authenticated.");
    }

    // Add image either through URL and upload to storage service or @RequestParam MultipartFile image
    @PostMapping(value = "/add-field")
    public void addField(HttpServletRequest request, @RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        fieldService.add_field(request, fieldBody.getName(), fieldBody.getDescription(), fieldBody.getAddress(), fieldBody.getZipCode(), fieldBody.getCity());
    }

    @PostMapping(value = "/edit-field")
    public void editField(HttpServletRequest request, @RequestBody Field fieldBody) throws URISyntaxException, IOException, InterruptedException {
        fieldService.edit_field(request, fieldBody.getFieldId(), fieldBody.getName(), fieldBody.getDescription(), fieldBody.getAddress(), fieldBody.getZipCode(), fieldBody.getCity());
    }

    @PostMapping(value = "/add-subfield")
    public void addSubfield(HttpServletRequest request, @RequestBody SubField subfieldBody) throws URISyntaxException, IOException, InterruptedException {
        subFieldService.add_subfield(request, subfieldBody.getMasterFieldId(), subfieldBody.getName());
    }

    @PostMapping(value = "/add-field-schedule")
    public void addFieldSchedule(HttpServletRequest request, @RequestBody FieldSchedule fieldScheduleBody) throws URISyntaxException, IOException, InterruptedException {
        fieldScheduleService.add_field_schedule(request, fieldScheduleBody.getSubFieldId(), fieldScheduleBody.getStartDate(), fieldScheduleBody.getEndDate());
    }

    @GetMapping(value = "/get-games")
    public Object getGames(@RequestParam Float latitude, @RequestParam Float longitude, @RequestParam Float distance) {
        return gameService.get_games(latitude, longitude, distance);
    }

    @GetMapping(value = "/get-game-data")
    public Object getGameData(@RequestParam Integer gameId) {
        return gameService.get_game_data(gameId);
    }

    @PostMapping(value = "/add-game")
    public void addGame(HttpServletRequest request, @RequestBody Game gameBody) {
        gameService.addGame(gameBody.getSubFieldId(), gameBody.getName(), gameBody.getStartDate(), gameBody.getEndDate());
    }

    @GetMapping(value = "/get-owner-fields")
    public Object getOwnerFields(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException {
        return fieldService.getOwnerFields(request);
    }

    @GetMapping(value = "/get-user")
    public Map<String, Object> getUser(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException {
        return userService.getUser(request);
    }

    @PostMapping(value = "/edit-user")
    public void editUser(HttpServletRequest request, @RequestBody Users userBody) throws URISyntaxException, IOException, InterruptedException {
        userService.editUser(request, userBody.getFirstName(), userBody.getLastName(), userBody.getUsername(), userBody.getBio(), userBody.getProfilePicture());
    }
    

}