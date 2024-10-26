package com.playvu.backend.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class FieldService {

    private static final String GEOCODING_API_KEY = "671c296419c1b876867424nil7cf9a2";
    private static final String GEOCODING_API = "671c296419c1b876867424nil7cf9a2";

    // public void get_coordinates_by_address(String location){
    //     HttpClient httpClient = HttpClient.newHttpClient();

    //     String encodedQuery = URLEncoder.encode(location,"UTF-8");
    //     String requestUri = GEOCODING_RESOURCE + "?apiKey=" + GEOCODING_API_KEY + "&q=" + encodedQuery;

    //     HttpRequest geocodingRequest = HttpRequest.newBuilder().GET().uri(URI.create(requestUri))
    //             .timeout(Duration.ofMillis(2000)).build();

    //     HttpResponse geocodingResponse = httpClient.send(geocodingRequest,
    //             HttpResponse.BodyHandlers.ofString());

    //     return geocodingResponse.body();
    // }
}
