package com.playvu.backend.service;



import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.playvu.backend.entity.SubField;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
import com.playvu.backend.repository.GameRepository;
import com.playvu.backend.repository.SubFieldRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class SubFieldService {
    @Autowired
    private SubFieldRepository subFieldRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private FieldScheduleRepository fieldScheduleRepository;

    public Integer addSubField(HttpServletRequest request, Integer fieldId, String name) throws URISyntaxException, IOException, InterruptedException{

        Users user = userService.getUserFromJwt();

        if(fieldRepository.findById(fieldId).get().getOwnerId() != user.getUserId()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control field: " + fieldId);
        }

        SubField new_subfield = new SubField();
        new_subfield.setMasterFieldId(fieldId);

        new_subfield.setName(name);

        subFieldRepository.save(new_subfield);
        return new_subfield.getSubFieldId();

    }

    public void deleteSubField(HttpServletRequest request, Integer subFieldId) throws URISyntaxException, IOException, InterruptedException{

        Users user = userService.getUserFromJwt();

        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if(fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control subfield: " + subFieldId);
        }
        System.out.println(gameRepository.isPendingGame(subFieldId));
        if(gameRepository.isPendingGame(subFieldId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Pending game in subfield: " + subFieldId);
        }
        

        subFieldRepository.deleteById(subFieldId);
    }

    public List<Map<String, Object>> getSubFieldSchedules(Integer subFieldId){
      Users user = userService.getUserFromJwt();
      // if(user.getRole().toLowerCase().strip() != "captain"){ // Stripping should be done when updating roles to not have to do the check every time
      //     return;
      // }
  
      return fieldScheduleRepository.findBySubFieldId(subFieldId);
    }
    
    
}
