package com.playvu.backend.service;



import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.playvu.backend.entity.FieldSchedule;
import com.playvu.backend.entity.SubField;
import com.playvu.backend.repository.FieldScheduleRepository;
// import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.SubFieldRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class FieldScheduleService {
    @Autowired
    private FieldScheduleRepository field_schedule_repository;

    public void add_field_schedule(HttpServletRequest request, Integer subfield_id, LocalDateTime start_date, LocalDateTime end_date){

        // Users user = auth_service.find_user_by_token(request);
        // if(user.getRole().toLowerCase().strip() != "field owner"){ // Stripping should be done when updating roles to not have to do the check everytime
        //     return;
        // }
        // if(subfield_repository.findById(field_id).get().getOwnerId() != user.getUserId()){
        //     return;
        // }

        FieldSchedule new_schedule = new FieldSchedule(); 
        new_schedule.setSubFieldId(subfield_id); // TODO: do checks
        
        if(start_date.isAfter(end_date)){
            return;
        }

        new_schedule.setStartDate(start_date);
        new_schedule.setEndDate(end_date);



        field_schedule_repository.save(new_schedule);
    }
    
}
