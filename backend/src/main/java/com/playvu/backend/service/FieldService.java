package com.playvu.backend.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.playvu.backend.entity.Field;
// import com.playvu.backend.entity.SubField;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
import com.playvu.backend.repository.GameRepository;
import com.playvu.backend.repository.SubFieldRepository;


@Service
public class FieldService {

    @Autowired 
    private FieldRepository fieldRepository;

    @Autowired 
    private SubFieldRepository subFieldRepository;

    @Autowired 
    private FieldScheduleRepository fieldScheduleRepository;

    @Autowired 
    private GameRepository gameRepository;

    @Autowired
    private UserService userService;

    private static final String GEOCODING_API_KEY = "671c296419c1b876867424nil7cf9a2";
    private static final String GEOCODING_API = "https://geocode.maps.co/search?q=";
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /**
     * Retrieves the coordinates (latitude and longitude) for a given address using a geocoding API.
     *
     * @param location the address to be geocoded
     * @return a map containing the latitude and longitude of the address
     * @throws IOException if an I/O error occurs
     * @throws InterruptedException if the thread is interrupted
     */
    public Map<String, Float> getCoordinatesByAddress(String location) throws IOException, InterruptedException {
      String encodedLocation = URLEncoder.encode(location, "UTF-8");
      String requestUri = GEOCODING_API + encodedLocation + "&api_key=" + GEOCODING_API_KEY;

      HttpRequest geocodingRequest = HttpRequest.newBuilder().GET().uri(URI.create(requestUri)).build();
      HttpResponse<String> geocodingResponse = HTTP_CLIENT.send(geocodingRequest, HttpResponse.BodyHandlers.ofString());

      JsonNode rootNode = OBJECT_MAPPER.readTree(geocodingResponse.body());
      JsonNode geocodingFirstResult = rootNode.get(0);

      Float latitude = Float.parseFloat(geocodingFirstResult.get("lat").asText());
      Float longitude = Float.parseFloat(geocodingFirstResult.get("lon").asText());

      Map<String, Float> coordinates = new HashMap<>();
      coordinates.put("latitude", latitude);
      coordinates.put("longitude", longitude);

      return coordinates;
    }

    /**
    * Adds a new field with the specified details.
    *
    * @param name the name of the field
    * @param description a description of the field
    * @param price the price of the field
    * @param picture a URL or identifier for the field's picture
    * @param address the street address of the field
    * @param zipCode the ZIP code of the field
    * @param city the city of the field
    * @return the ID of the newly created field
    * @throws URISyntaxException if the URI for the geocoding request is malformed
    * @throws IOException if an I/O error occurs
    * @throws InterruptedException if the thread is interrupted
    */
    public Integer addField(String name, String description, Float price, String picture, String address, String zipCode, String city) 
          throws URISyntaxException, IOException, InterruptedException {
      Users user = userService.getUserFromJwt();
      String fullAddress = address + ", " + zipCode + ", " + city;
      Map<String, Float> newFieldCoordinates = getCoordinatesByAddress(fullAddress);

      Field newField = new Field();
      newField.setOwnerId(user.getUserId());
      newField.setName(name);
      newField.setDescription(description);
      newField.setAddress(address);
      newField.setZipCode(zipCode);
      newField.setCity(city);
      newField.setPrice(price);
      newField.setPicture(picture);
      newField.setAvailable(true);
      newField.setLatitude(newFieldCoordinates.get("latitude"));
      newField.setLongitude(newFieldCoordinates.get("longitude"));

      fieldRepository.save(newField);
      System.out.println("Saved Field: " + newField);
      return newField.getFieldId();
    }

    /**
    * Edits an existing field with the specified details.
    *
    * @param fieldId the ID of the field to edit
    * @param name the updated name of the field
    * @param description the updated description of the field
    * @param price the updated price of the field
    * @param picture the updated picture of the field
    * @param address the updated street address of the field
    * @param zipCode the updated ZIP code of the field
    * @param city the updated city of the field
    * @throws URISyntaxException if the URI for the geocoding request is malformed
    * @throws IOException if an I/O error occurs
    * @throws InterruptedException if the thread is interrupted
    */
    public void editField(Integer fieldId, String name, String description, Float price, String picture, String address, String zipCode, String city) 
          throws URISyntaxException, IOException, InterruptedException {
      Users user = userService.getUserFromJwt();
      Field field = fieldRepository.findById(fieldId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Field not found"));
      if (!field.getOwnerId().equals(user.getUserId())) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not own the field");
      }

      if (name != null) field.setName(name);
      if (description != null) field.setDescription(description);
      if (picture != null) field.setPicture(picture);
      if (address != null) field.setAddress(address);
      if (zipCode != null) field.setZipCode(zipCode);
      if (city != null) field.setCity(city);
      if (price != null) field.setPrice(price);

      if (address != null && zipCode != null && city != null) {
          String fullAddress = address + ", " + zipCode + ", " + city;
          Map<String, Float> newFieldCoordinates = getCoordinatesByAddress(fullAddress);
          field.setLatitude(newFieldCoordinates.get("latitude"));
          field.setLongitude(newFieldCoordinates.get("longitude"));
      }

      fieldRepository.save(field);
    }

    /**
    * Soft deletes a field by marking it as unavailable.
    *
    * @param fieldId the ID of the field to delete
    */
    public void deleteField(Integer fieldId) {
      Users user = userService.getUserFromJwt();
      Field field = fieldRepository.findById(fieldId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Field not found"));

      if (!field.getOwnerId().equals(user.getUserId())) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control the field");
      }

      List<Integer> subFieldIds = subFieldRepository.findIdsByMasterFieldId(fieldId);
      if (gameRepository.isPendingGames(subFieldIds)) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Field has pending games");
      }

      field.setAvailable(false);
      fieldRepository.save(field);
    }

    /**
    * Retrieves all fields owned by the authenticated user, including subfields and their data.
    *
    * @return a list of fields with subfield details
    * @throws URISyntaxException if URI construction fails
    * @throws IOException if an I/O error occurs
    * @throws InterruptedException if the thread is interrupted
    */
    public Object getOwnerFields() throws URISyntaxException, IOException, InterruptedException {
      Users user = userService.getUserFromJwt();
      List<Map<String, Object>> fields = new ArrayList<>();
      List<Map<String, Object>> originalFields = fieldRepository.findByOwnerId(user.getUserId());

      for (Map<String, Object> originalField : originalFields) {
          Map<String, Object> field = new HashMap<>(originalField);
          Integer fieldId = (Integer) field.get("fieldId");

          List<Map<String, Object>> subFields = new ArrayList<>();
          List<Map<String, Object>> originalSubFields = subFieldRepository.findByMasterFieldId(fieldId);

          for (Map<String, Object> originalSubField : originalSubFields) {
              Map<String, Object> subField = new HashMap<>(originalSubField);
              Integer subFieldId = (Integer) subField.get("subFieldId");
              subField.put("data", gameRepository.findAllBySubFieldId(subFieldId));
              subFields.add(subField);
          }

          field.put("subFields", subFields);
          fields.add(field);
      }

      return fields;
    }

    /**
    * Retrieves all schedules and games for a specific field.
    *
    * @param fieldId the ID of the field to retrieve schedules and games for
    * @return a list of subfields with combined schedule and game data
    * @throws URISyntaxException if URI construction fails
    * @throws IOException if an I/O error occurs
    * @throws InterruptedException if the thread is interrupted
    */
    public List<Map<String, Object>> getFieldSchedules(Integer fieldId) throws URISyntaxException, IOException, InterruptedException {
      Users user = userService.getUserFromJwt();
      if (!fieldRepository.findById(fieldId).get().getOwnerId().equals(user.getUserId())) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control the field");
      }

      List<Map<String, Object>> subFields = new ArrayList<>();
      List<Map<String, Object>> originalSubFields = subFieldRepository.findByMasterFieldId(fieldId);

      for (Map<String, Object> originalSubField : originalSubFields) {
          Map<String, Object> subField = new HashMap<>(originalSubField);
          Integer subFieldId = (Integer) subField.get("subFieldId");

          List<Map<String, Object>> schedules = fieldScheduleRepository.findBySubFieldId(subFieldId);
          schedules.forEach(schedule -> schedule.put("type", "schedule"));

          List<Map<String, Object>> games = gameRepository.findAllBySubFieldId(subFieldId);
          games.forEach(game -> game.put("type", "game"));

          List<Map<String, Object>> combinedData = new ArrayList<>();
          combinedData.addAll(schedules);
          combinedData.addAll(games);

          subField.put("data", combinedData);
          subFields.add(subField);
      }

      return subFields;
    }

    
    
  }
