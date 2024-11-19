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
import com.playvu.backend.entity.SubField;
// import com.playvu.backend.entity.SubField;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.FieldRepository;
import com.playvu.backend.repository.FieldScheduleRepository;
import com.playvu.backend.repository.GameRepository;
import com.playvu.backend.repository.SubFieldRepository;

import jakarta.servlet.http.HttpServletRequest;

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

    public Map<String, Float> getCoordinatesByAddress(String location) throws IOException, InterruptedException{

        String encodedLocation = URLEncoder.encode(location,"UTF-8");
        String requestUri = GEOCODING_API + encodedLocation + "&api_key=" + GEOCODING_API_KEY;

        HttpRequest geocodingRequest = HttpRequest.newBuilder().GET().uri(URI.create(requestUri)).build();

        HttpResponse<String> geocodingResponse = HTTP_CLIENT.send(geocodingRequest, HttpResponse.BodyHandlers.ofString());

        JsonNode rootNode = OBJECT_MAPPER.readTree(geocodingResponse.body());

        JsonNode geocodingFirstResult = rootNode.get(0);

        
        Float latitude = Float.parseFloat( geocodingFirstResult.get("lat").asText() );
        Float longitude = Float.parseFloat( geocodingFirstResult.get("lon").asText() );

        Map<String, Float> coordinates = new HashMap<>();
        coordinates.put("latitude", latitude);
        coordinates.put("longitude", longitude);

        return coordinates;
    }

    public Integer addField(HttpServletRequest request, String name, String description, Float price, String address, String zipCode, String city) throws URISyntaxException, IOException, InterruptedException{
        Users user = userService.getUserFromJwt();
        // if(user.getRole().toLowerCase().strip() != "field owner"){ // Stripping should be done when updating roles to not have to do the check everytime
        //     return;
        // }
        String full_address = address + ", " + zipCode + ", " + city;
        Map<String, Float> new_field_coordinates = getCoordinatesByAddress(full_address);
        Field newField = new Field();

        newField.setOwnerId(user.getUserId());
        newField.setName(name);
        newField.setDescription(description);
        newField.setAddress(address);
        newField.setZipCode(zipCode);
        newField.setCity(city);
        newField.setPrice(price);
        newField.setAvailable(true);
        
        newField.setLatitude(new_field_coordinates.get("latitude"));
        newField.setLongitude(new_field_coordinates.get("longitude"));
        
        fieldRepository.save(newField);
        return newField.getFieldId();
        
    }

    public void editField(HttpServletRequest request, Integer field_id, String name, String description, String address, String zip_code, String city) throws URISyntaxException, IOException, InterruptedException{
        Users user = userService.getUserFromJwt();
        // if(user.getRole().toLowerCase().strip() != "field owner"){ // Stripping should be done when updating roles to not have to do the check everytime
        //     return;
        // }
        
        Field field = fieldRepository.findById(field_id).get();
        if(field.getOwnerId() != user.getUserId()){
          return;
        }

        if(name != null){
            field.setName(name);
        }
        if(description != null){
            field.setDescription(description);
        }
        if(address != null){
            field.setAddress(address);
        }
        if(zip_code != null){
            field.setZipCode(zip_code);
        }
        if(city != null){
            field.setCity(city);
        }
        
        // TODO: Decide if we need to change coordinates if address switches
        // String full_address = address + ", " + zip_code + ", " + city;
        // Map<String, Float> new_field_coordinates = getCoordinatesByAddress(full_address);
        // field.setLatitude(new_field_coordinates.get("latitude"));
        // field.setLongitude(new_field_coordinates.get("longitude"));
        
        fieldRepository.save(field);
    }


    public void deleteField(Integer fieldId){
        Users user = userService.getUserFromJwt();

        if(fieldRepository.findById(fieldId).get().getOwnerId() != user.getUserId()){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not control field: " + fieldId);
        }
        List<Integer> subFieldIds = subFieldRepository.findIdsByMasterFieldId(fieldId);
        
        if(gameRepository.isPendingGames(subFieldIds)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Pending game in field: " + fieldId);
        }
        
        Field field = fieldRepository.findById(fieldId).get();
        field.setAvailable(false);
        fieldRepository.save(field);

        return;
    }

    public Object getOwnerFields(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException {
      Users user = userService.getUserFromJwt();
      // if(user.getRole().toLowerCase().strip() != "field owner"){ // Stripping should be done when updating roles to not have to do the check every time
      //     return;
      // }
  
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

    public List<Map<String, Object>> getFieldSchedules(HttpServletRequest request, Integer fieldId) throws URISyntaxException, IOException, InterruptedException {
      Users user = userService.getUserFromJwt();
  
      if (fieldRepository.findById(fieldId).get().getOwnerId() != user.getUserId()) {
          return null;
      }
  
      List<Map<String, Object>> subFields = new ArrayList<>();
      List<Map<String, Object>> originalSubFields = subFieldRepository.findByMasterFieldId(fieldId);
  
      for (Map<String, Object> originalSubField : originalSubFields) {
          Map<String, Object> subField = new HashMap<>(originalSubField);
          Integer subFieldId = (Integer) subField.get("subFieldId");
  
          List<Map<String, Object>> schedules = fieldScheduleRepository.findBySubFieldId(subFieldId);
          List<Map<String, Object>> modifiableSchedules = new ArrayList<>();
          for (Map<String, Object> schedule : schedules) {
              Map<String, Object> modifiableSchedule = new HashMap<>(schedule);
              modifiableSchedule.put("type", "schedule");
              modifiableSchedules.add(modifiableSchedule);
          }
  
          List<Map<String, Object>> games = gameRepository.findAllBySubFieldId(subFieldId);
          List<Map<String, Object>> modifiableGames = new ArrayList<>();
          for (Map<String, Object> game : games) {
              Map<String, Object> modifiableGame = new HashMap<>(game);
              modifiableGame.put("type", "game");
              modifiableGames.add(modifiableGame);
          }
  
          List<Map<String, Object>> combinedData = new ArrayList<>();
          combinedData.addAll(modifiableSchedules);
          combinedData.addAll(modifiableGames);
  
          subField.put("data", combinedData);
          subFields.add(subField);
      }
  
      return subFields;

      
  }

    
    
  }



/* Example of what API returns with input: 1541 Moritz Dr
 * 
 * [
  {
    "place_id": 269395197,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 15443633,
    "boundingbox": [
      "29.7946857",
      "29.8030067",
      "-95.4970563",
      "-95.496309"
    ],
    "lat": "29.7977063",
    "lon": "-95.4970278",
    "display_name": "Moritz Drive, Spring Branch, Houston, Harris County, Texas, 77055, United States",
    "class": "highway",
    "type": "residential",
    "importance": 0.30000999999999994
  },
  {
    "place_id": 281615062,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 13360553,
    "boundingbox": [
      "33.7240603",
      "33.7250441",
      "-118.0744976",
      "-118.072494"
    ],
    "lat": "33.7241513",
    "lon": "-118.0726262",
    "display_name": "Moritz Drive, Huntington Beach, Orange County, California, 92649, United States",
    "class": "highway",
    "type": "residential",
    "importance": 0.30000999999999994
  },
  {
    "place_id": 17777209,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 702041287,
    "boundingbox": [
      "-37.5874798",
      "-37.5866876",
      "143.7977165",
      "143.797855"
    ],
    "lat": "-37.5874055",
    "lon": "143.7977295",
    "display_name": "Moritz Drive, Winter Valley, Ballarat, City of Ballarat, Victoria, 3358, Australia",
    "class": "highway",
    "type": "residential",
    "importance": 0.30000999999999994
  },
  {
    "place_id": 285238228,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 10433175,
    "boundingbox": [
      "35.065416",
      "35.072199",
      "-118.527116",
      "-118.524572"
    ],
    "lat": "35.068344",
    "lon": "-118.525198",
    "display_name": "Moritz Drive, Kern County, California, United States",
    "class": "highway",
    "type": "residential",
    "importance": 0.30000999999999994
  },
  {
    "place_id": 310588936,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 205122064,
    "boundingbox": [
      "40.3794713",
      "40.3811931",
      "-76.4802034",
      "-76.4785781"
    ],
    "lat": "40.3806403",
    "lon": "-76.4798027",
    "display_name": "Moritz Drive, Mount Ararat, Swatara Township, Lebanon County, Pennsylvania, 17038, United States",
    "class": "highway",
    "type": "residential",
    "importance": 0.30000999999999994
  },
  {
    "place_id": 307753482,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 16585454,
    "boundingbox": [
      "36.237115",
      "36.241569",
      "-79.949735",
      "-79.94634"
    ],
    "lat": "36.2400919",
    "lon": "-79.9463747",
    "display_name": "Moritz Drive, Stokesdale, Guilford County, North Carolina, 27357, United States",
    "class": "highway",
    "type": "residential",
    "importance": 0.30000999999999994
  },
  {
    "place_id": 297026956,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 12848900,
    "boundingbox": [
      "33.6639686",
      "33.6640042",
      "-94.1146821",
      "-94.1122503"
    ],
    "lat": "33.6640042",
    "lon": "-94.1146821",
    "display_name": "Moritz Drive, Ashdown, Little River County, Arkansas, 71822, United States",
    "class": "highway",
    "type": "residential",
    "importance": 0.30000999999999994
  }
]
 */
