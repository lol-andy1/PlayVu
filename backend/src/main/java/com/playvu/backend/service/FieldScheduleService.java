package com.playvu.backend.service;



import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.playvu.backend.entity.FieldSchedule;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
import com.playvu.backend.repository.SubFieldRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class FieldScheduleService {
    @Autowired
    private FieldScheduleRepository fieldScheduleRepository;

    @Autowired
    private SubFieldRepository subFieldRepository;

    @Autowired
    private FieldRepository fieldRepository;

    @Autowired
    private UserService userService;

    public void addFieldSchedule(HttpServletRequest request, Integer subFieldId, LocalDateTime startDate, LocalDateTime endDate) throws URISyntaxException, IOException, InterruptedException{

        Users user = userService.getUserFromJwt();

        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if(fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control subfield: " + subFieldId);
        }

        FieldSchedule new_schedule = new FieldSchedule(); 
        
        new_schedule.setSubFieldId(subFieldId); 
        
        if(startDate.isAfter(endDate)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "End date cannot be before start date");
        }
        if(endDate.isBefore(LocalDateTime.now(ZoneOffset.UTC))){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "End date cannot be before current date");
        }

        new_schedule.setStartDate(startDate);
        new_schedule.setEndDate(endDate);



        fieldScheduleRepository.save(new_schedule);
    }

    public void editFieldSchedule(HttpServletRequest request, Integer fieldScheduleId, LocalDateTime startDate, LocalDateTime endDate) throws URISyntaxException, IOException, InterruptedException{

        Users user = userService.getUserFromJwt();

        FieldSchedule fieldSchedule = fieldScheduleRepository.findByFieldScheduleId(fieldScheduleId);

        Integer subFieldId = fieldSchedule.getSubFieldId();
        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if(fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()){
            return;
        }

        if(startDate != null){
            if(startDate.isAfter(fieldSchedule.getEndDate())){
                return;
            }
            fieldSchedule.setStartDate(startDate);
        }
        if(endDate != null){
            if(endDate.isBefore(fieldSchedule.getStartDate())){
                return;
            }
            fieldSchedule.setEndDate(endDate);
        }
        
        if(startDate.isAfter(endDate)){
            return;
        }

        fieldScheduleRepository.save(fieldSchedule);
    }

    public void deleteFieldSchedule(HttpServletRequest request, Integer fieldScheduleId) throws URISyntaxException, IOException, InterruptedException{

        Users user = userService.getUserFromJwt();

        FieldSchedule fieldSchedule = fieldScheduleRepository.findByFieldScheduleId(fieldScheduleId);

        Integer subFieldId = fieldSchedule.getSubFieldId();
        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if(fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()){
            return;
        }

        fieldScheduleRepository.deleteById(fieldScheduleId);
    }
    
}
