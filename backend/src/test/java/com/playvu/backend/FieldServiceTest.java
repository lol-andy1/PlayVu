package com.playvu.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.playvu.backend.entity.Field;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.service.*;

class FieldServiceTest {

    @InjectMocks
    private FieldService fieldService;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void validAddField() throws URISyntaxException, IOException, InterruptedException {
        Users mockUser = new Users();
        mockUser.setUserId(1);

        when(userService.getUserFromJwt()).thenReturn(mockUser);

        Map<String, Float> mockCoordinates = new HashMap<>();
        mockCoordinates.put("latitude", 12.34f);
        mockCoordinates.put("longitude", 56.78f);
        FieldService fieldServiceSpy = spy(fieldService);
        doReturn(mockCoordinates).when(fieldServiceSpy).getCoordinatesByAddress(anyString());

        Field savedField = new Field();
        savedField.setFieldId(1);

        when(fieldRepository.save(any(Field.class))).thenAnswer(invocation -> {
            Field field = invocation.getArgument(0); // Get the field passed to save
            field.setFieldId(1); // Simulate that the DB would assign an ID
            return field; // Return the field with the ID set
        });
        
        Integer fieldId = fieldServiceSpy.addField("Soccer Field", "A soccer field",
        100.0f, "soccer.png", "123 Main St", "12345", "Sample City");

        // Assert
        assertNotNull(fieldId);
        assertEquals(1, fieldId);
        verify(fieldRepository, times(1)).save(any(Field.class));
    }

    // @Test
    // void addField_GeocodingApiFailure() throws IOException, InterruptedException, URISyntaxException {
    //     // Arrange
    //     Users mockUser = new Users();
    //     mockUser.setUserId(1);

    //     when(userService.getUserFromJwt()).thenReturn(mockUser);

    //     FieldService fieldServiceSpy = spy(fieldService);
    //     doThrow(new IOException("Geocoding API failed")).when(fieldServiceSpy).getCoordinatesByAddress(anyString());

    //     // Act & Assert
    //     assertThrows(IOException.class, () -> {
    //         fieldServiceSpy.addField("Soccer Field", "A soccer field", 100.0f, "soccer.png", "123 Main St", "12345", "Sample City");
    //     });
    // }
    
}