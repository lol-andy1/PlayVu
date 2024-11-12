package com.playvu.backend.service;



import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.playvu.backend.entity.SubField;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
// import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.SubFieldRepository;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.List;

@Service
public class SubFieldService {
    @Autowired
    private SubFieldRepository subFieldRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FieldScheduleRepository fieldScheduleRepository;

    // @Autowired
    // private FieldRepository field_repository;

    public Integer addSubField(HttpServletRequest request, Integer field_id, String name) throws URISyntaxException, IOException, InterruptedException{

        Users user = userService.findUserByToken(request);
        // if(user.getRole().toLowerCase().strip() != "field owner"){ // Stripping should be done when updating roles to not have to do the check everytime
        //     return;
        // }
        if(fieldRepository.findById(field_id).get().getOwnerId() != user.getUserId()){
            return null;
        }

        SubField new_subfield = new SubField();
        new_subfield.setMasterFieldId(field_id);

        new_subfield.setName(name);

        subFieldRepository.save(new_subfield);
        return new_subfield.getSubFieldId();

    }

    public void deleteSubField(HttpServletRequest request, Integer subFieldId) throws URISyntaxException, IOException, InterruptedException{

        Users user = userService.findUserByToken(request);
        // if(user.getRole().toLowerCase().strip() != "field owner"){ // Stripping should be done when updating roles to not have to do the check everytime
        //     return;
        // }
        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if(fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()){
            return;
        }

        subFieldRepository.deleteById(subFieldId);
    }
    
}
