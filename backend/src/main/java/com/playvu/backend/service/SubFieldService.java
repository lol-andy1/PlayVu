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

    /**
     * Adds a new subfield under a specified field.
     * The user must be the owner of the field to add a subfield.
     * 
     * @param fieldId The ID of the field to which the subfield will be added.
     * @param name The name of the new subfield.
     * @return The ID of the newly created subfield.
     * @throws URISyntaxException If there is a URI syntax error.
     * @throws IOException If an I/O error occurs.
     * @throws InterruptedException If the operation is interrupted.
     * @throws ResponseStatusException If the user is not the owner of the field.
     */
    public Integer addSubField(Integer fieldId, String name) throws URISyntaxException, IOException, InterruptedException {

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

    /**
     * Deletes a subfield. The user must be the owner of the master field and there should be no pending games 
     * in the subfield.
     * 
     * @param subFieldId The ID of the subfield to be deleted.
     * @throws URISyntaxException If there is a URI syntax error.
     * @throws IOException If an I/O error occurs.
     * @throws InterruptedException If the operation is interrupted.
     * @throws ResponseStatusException If the user is not the owner of the subfield or if a pending game exists in the subfield.
     */
    public void deleteSubField(Integer subFieldId) throws URISyntaxException, IOException, InterruptedException {

        Users user = userService.getUserFromJwt();

        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if(fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control subfield: " + subFieldId);
        }

        if(gameRepository.isPendingGame(subFieldId)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Pending game in subfield: " + subFieldId);
        }

        subFieldRepository.deleteById(subFieldId);
    }

    /**
     * Retrieves the schedules for a specific subfield.
     * 
     * @param subFieldId The ID of the subfield whose schedules are to be retrieved.
     * @return A list of maps containing the schedules associated with the subfield.
     */
    public List<Map<String, Object>> getSubFieldSchedules(Integer subFieldId) {
        Users user = userService.getUserFromJwt();

        // The user role check could be implemented here if necessary
        // if(user.getRole().toLowerCase().strip() != "captain"){ 
        //     return;
        // }

        return fieldScheduleRepository.findBySubFieldId(subFieldId);
    }
    
    
}
