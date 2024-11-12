package com.playvu.backend.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.UsersRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthService {
    @Autowired 
    private UsersRepository users_repository;

    // TODO: Haven't tested functionality
    public Users find_user_by_token(HttpServletRequest request)
            throws URISyntaxException, IOException, InterruptedException {
        String access_token = request.getHeader("Authorization");

        if (access_token == null) {return null;}

        String url = "https://dev-1jps85kh7htbmqki.us.auth0.com/userinfo";
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
        
        Users user = users_repository.findByEmail(email);

        return user;
    }
}
