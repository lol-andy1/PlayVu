package com.playvu.backend.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.GameRepository;
import com.playvu.backend.repository.SubFieldRepository;
import com.playvu.backend.entity.*;

@Service
public class GameService {
    @Autowired 
    private GameRepository game_repository;

    @Autowired 
    private SubFieldRepository sub_field_repository;

    @Autowired 
    private FieldRepository field_repository;


    public List<Object> get_games(){
        Field field = new Field();
        field.setOwnerId(1); // Set an appropriate owner ID
        field.setLocation("Test Location");
        field = field_repository.save(field); // Assuming fieldRepository is defined

        // Create and save the SubField
        SubField subField = new SubField();
        subField.setMasterFieldId(field.getFieldId()); // Link to the master field
        subField = sub_field_repository.save(subField); // Assuming subFieldRepository is defined





        Game test_game = new Game();

        test_game.setOrganizerId(0);
        test_game.setSubFieldId(0);
        test_game.setStartDate(LocalDateTime.now());
        test_game.setDuration(LocalTime.of(1, 0, 0));
        test_game.setName("test game");

        game_repository.save(test_game);
        
        return game_repository.findBySubFieldId(0);

    }
    
}
