package com.playvu.backend.controller;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.playvu.backend.service.FieldService;
import com.playvu.backend.service.GameService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)
// Allow all origins for simplicity, change for production.
@CrossOrigin(origins = "*")
public class APIController {

    @Autowired
    private GameService game_service;
    
    @Autowired
    private FieldService field_service;

    @GetMapping(value = "/public")
    public String publicEndpoint() {
        return "No authentication required.";
    }

    @GetMapping(value = "/private")
    public Message privateEndpoint() {
        return new Message("All good. You can see this because you are Authenticated.");
    }

    @PostMapping(value = "/add-field")
    public void add_field(HttpServletRequest request, @RequestParam String description, @RequestParam String location, @RequestParam MultipartFile image) throws URISyntaxException, IOException, InterruptedException {
        field_service.add_field(request, description, location, image);
    }

    @GetMapping(value = "/get-games")
    public Object get_games(@RequestParam Float latitude, @RequestParam Float longitude, @RequestParam Float distance) {
        return game_service.get_games(latitude, longitude, distance);
    }

}