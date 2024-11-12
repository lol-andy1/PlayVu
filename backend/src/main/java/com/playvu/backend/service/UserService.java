package com.playvu.backend.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.UsersRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {
    @Autowired 
    private UsersRepository usersRepository;

    // TODO: Haven't tested functionality
    public Users findUserByToken(HttpServletRequest request)
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
        
        Users user = usersRepository.findByEmail(email);

        return user;
    }

    public Map<String, Object> getUser(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException{
        Users user = findUserByToken(request);
        return usersRepository.userDataByEmail(user.getEmail());
    }

    public void editUser(HttpServletRequest request, String firstName, String lastName, String username, String bio, String profilePicture) throws URISyntaxException, IOException, InterruptedException{
        Users user = findUserByToken(request);

        if (firstName != null) {
            user.setFirstName(firstName);
        }
        if (lastName != null) {
            user.setLastName(lastName);
        }
        if (username != null) {
            user.setUsername(username);
        }
        if (bio != null) {
            user.setBio(bio);
        }
        if (profilePicture != null) {
            user.setProfilePicture(profilePicture);
        }

        usersRepository.save(user);
        
    }

    
}
