package com.playvu.backend.service;



import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.playvu.backend.entity.FieldSchedule;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
import com.playvu.backend.repository.SubFieldRepository;


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

    /**
     * Adds a new schedule for a specific subfield.
     * Ensures the user owns the master field associated with the subfield, validates the schedule, 
     * and handles overlapping schedules by merging them into a single schedule.
     *
     * @param subFieldId the ID of the subfield to which the schedule is being added
     * @param startDate the start date and time of the schedule
     * @param endDate the end date and time of the schedule
     * @throws URISyntaxException if an invalid URI is encountered
     * @throws IOException if an I/O error occurs
     * @throws InterruptedException if the thread is interrupted during execution
     * @throws ResponseStatusException if the user does not own the subfield, 
     *         the end date is before the start date, or the end date is in the past
     */
    public void addFieldSchedule(Integer subFieldId, LocalDateTime startDate, LocalDateTime endDate) 
            throws URISyntaxException, IOException, InterruptedException {

        Users user = userService.getUserFromJwt();

        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if (fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control subfield: " + subFieldId);
        }

        FieldSchedule newSchedule = new FieldSchedule();

        newSchedule.setSubFieldId(subFieldId);

        if (startDate.isAfter(endDate)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "End date cannot be before start date");
        }
        if (endDate.isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "End date cannot be before current date");
        }

        List<FieldSchedule> overlappingSchedules = fieldScheduleRepository.findOverlappingSchedules(subFieldId, startDate, endDate);

        if (!overlappingSchedules.isEmpty()) {
            for (FieldSchedule overlap : overlappingSchedules) {
                startDate = startDate.isBefore(overlap.getStartDate()) ? startDate : overlap.getStartDate();
                endDate = endDate.isAfter(overlap.getEndDate()) ? endDate : overlap.getEndDate();
                fieldScheduleRepository.delete(overlap);
            }
        }
        newSchedule.setStartDate(startDate);
        newSchedule.setEndDate(endDate);

        fieldScheduleRepository.save(newSchedule);
    }

    /**
     * Edits an existing field schedule.
     * Allows modifying the start and/or end date, ensuring the user owns the master field, 
     * and the new dates are valid.
     *
     * @param fieldScheduleId the ID of the schedule to be edited
     * @param startDate the new start date and time, or null to leave unchanged
     * @param endDate the new end date and time, or null to leave unchanged
     * @throws URISyntaxException if an invalid URI is encountered
     * @throws IOException if an I/O error occurs
     * @throws InterruptedException if the thread is interrupted during execution
     */
    public void editFieldSchedule(Integer fieldScheduleId, LocalDateTime startDate, LocalDateTime endDate) 
            throws URISyntaxException, IOException, InterruptedException {

        Users user = userService.getUserFromJwt();

        FieldSchedule fieldSchedule = fieldScheduleRepository.findByFieldScheduleId(fieldScheduleId);

        Integer subFieldId = fieldSchedule.getSubFieldId();
        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if (fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()) {
            return;
        }

        if (startDate != null) {
            if (startDate.isAfter(fieldSchedule.getEndDate())) {
                return;
            }
            fieldSchedule.setStartDate(startDate);
        }
        if (endDate != null) {
            if (endDate.isBefore(fieldSchedule.getStartDate())) {
                return;
            }
            fieldSchedule.setEndDate(endDate);
        }

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            return;
        }

        fieldScheduleRepository.save(fieldSchedule);
    }

    /**
     * Deletes an existing field schedule.
     * Ensures the user owns the master field associated with the schedule's subfield before deletion.
     *
     * @param fieldScheduleId the ID of the schedule to be deleted
     * @throws URISyntaxException if an invalid URI is encountered
     * @throws IOException if an I/O error occurs
     * @throws InterruptedException if the thread is interrupted during execution
     */
    public void deleteFieldSchedule(Integer fieldScheduleId) 
            throws URISyntaxException, IOException, InterruptedException {

        Users user = userService.getUserFromJwt();

        FieldSchedule fieldSchedule = fieldScheduleRepository.findByFieldScheduleId(fieldScheduleId);

        Integer subFieldId = fieldSchedule.getSubFieldId();
        Integer masterFieldId = subFieldRepository.findBySubFieldId(subFieldId).getMasterFieldId();
        if (fieldRepository.findById(masterFieldId).get().getOwnerId() != user.getUserId()) {
            return;
        }

        fieldScheduleRepository.deleteById(fieldScheduleId);
    }
    
}
