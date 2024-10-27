package com.playvu.backend.controller;

import java.io.IOException;
import java.net.URISyntaxException;

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

import com.playvu.backend.request.FieldBody;
import com.playvu.backend.request.SubFieldBody;
import com.playvu.backend.service.FieldService;
import com.playvu.backend.service.GameService;
import com.playvu.backend.service.SubFieldService;

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

    @Autowired
    private SubFieldService subfield_service;


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
    public void add_field(HttpServletRequest request, @RequestBody FieldBody field_body) throws URISyntaxException, IOException, InterruptedException {
        field_service.add_field(request, field_body.getName(), field_body.getDescription(), field_body.getAddress(), field_body.getZip_code(), field_body.getCity());
    }

    @PostMapping(value = "/edit-field")
    public void edit_field(HttpServletRequest request, @RequestBody FieldBody field_body) throws URISyntaxException, IOException, InterruptedException {
        field_service.edit_field(request, field_body.getField_id(), field_body.getName(), field_body.getDescription(), field_body.getAddress(), field_body.getZip_code(), field_body.getCity());
    }

    @PostMapping(value = "/add-subfield")
    public void add_subfield(HttpServletRequest request, @RequestBody SubFieldBody subfield_body) throws URISyntaxException, IOException, InterruptedException {
        subfield_service.add_subfield(request, subfield_body.getMaster_field_id(), subfield_body.getName());
    }

    @GetMapping(value = "/get-games")
    public Object get_games(@RequestParam Float latitude, @RequestParam Float longitude, @RequestParam Float distance) {
        return game_service.get_games(latitude, longitude, distance);
    }

}