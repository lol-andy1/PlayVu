package com.playvu.backend.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class Auth {
    public Map<String, String> find_user_by_token(HttpServletRequest request)
            throws URISyntaxException, IOException, InterruptedException {
        String access_token = request.getHeader("Authorization");

        if (access_token == null) {return null;}

        String url = "https://dev-1jps85kh7htbmqki.us.access_token0.com/userinfo";
        HttpRequest find_user_request = HttpRequest.newBuilder()
                .uri(new URI(url))
                .header("Authorization", access_token)
                .GET()
                .build();

        HttpClient httpClient = HttpClient.newHttpClient();
        HttpResponse<String> response = httpClient.send(find_user_request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode responseBody = objectMapper.readTree(response.body());
        String email = responseBody.get("email").asText();
        String first_name = responseBody.get("given_name").asText();
        String last_name = responseBody.get("family_name").asText();

        Map<String, String> user_info = new HashMap<>();
        user_info.put("email", email);
        user_info.put("first_name", first_name);
        user_info.put("last_name", last_name);

        return user_info;
    }
}
