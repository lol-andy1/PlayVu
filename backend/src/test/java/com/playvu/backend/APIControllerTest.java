package com.playvu.backend;

import com.playvu.backend.controller.APIController;
import com.playvu.backend.entity.Field;
import com.playvu.backend.security.SecurityConfig;
import com.playvu.backend.service.FieldScheduleService;
import com.playvu.backend.service.FieldService;
import com.playvu.backend.service.GameService;
import com.playvu.backend.service.SubFieldService;
import com.playvu.backend.service.UserService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.when;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(APIController.class)
@Import(SecurityConfig.class)
public class APIControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private FieldService fieldService;

    @MockBean
    private SubFieldService subFieldService;

    @MockBean
    private FieldScheduleService fieldScheduleService;

    @MockBean
    private GameService gameService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void validFieldBody() throws Exception {
        // Prepare test data
        Field field = new Field();
        field.setName("Soccer Field");
        field.setDescription("A large soccer field");
        field.setPicture("soccer_field.png");
        field.setAddress("123 Main St");
        field.setZipCode("12345");
        field.setCity("Sample City");

        // Mock the service call
        when(fieldService.addField(field.getName(),
                field.getDescription(),
                field.getPrice(),
                field.getPicture(),
                field.getAddress(),
                field.getZipCode(),
                field.getCity()
        )).thenReturn(1);

        // Perform the request
        mockMvc.perform(post("/api/add-field")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(field)))
                .andExpect(status().isOk())
                // Verify response is 1 (the field ID)
                .andExpect(content().string("1")); 
    }

    @Test
    void invalidNameFieldBody() throws Exception {
        // Prepare test data with missing required field 'name'
        Field field = new Field();
        field.setDescription("A large soccer field");

        // Perform the request
        mockMvc.perform(post("/api/add-field")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(field)))
                // Expecting 400 Bad Request for missing fields
                .andExpect(status().isBadRequest()); 
    }
}

