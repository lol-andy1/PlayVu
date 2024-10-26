package com.playvu.backend.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FieldService {

    private static final String GEOCODING_API_KEY = "671c296419c1b876867424nil7cf9a2";
    private static final String GEOCODING_API = "https://geocode.maps.co/search?q=";
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    public Map<String, String> get_coordinates_by_address(String location) throws IOException, InterruptedException{

        String encoded_location = URLEncoder.encode(location,"UTF-8");
        String request_uri = GEOCODING_API + encoded_location + "&api_key=" + GEOCODING_API_KEY;

        HttpRequest geocoding_request = HttpRequest.newBuilder().GET().uri(URI.create(request_uri)).build();

        HttpResponse<String> geocoding_response = HTTP_CLIENT.send(geocoding_request, HttpResponse.BodyHandlers.ofString());

        JsonNode root_node = OBJECT_MAPPER.readTree(geocoding_response.body());

        JsonNode first_result = root_node.get(0);

        
        String latitude = first_result.get("lat").asText();
        String longitude = first_result.get("lon").asText();

        Map<String, String> coordinates = new HashMap<>();
        coordinates.put("latitude", latitude);
        coordinates.put("longitude", longitude);

        return coordinates;
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
