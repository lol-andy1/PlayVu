package com.playvu.backend.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.playvu.backend.entity.Users;
import com.playvu.backend.repository.UsersRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {
    @Autowired 
    private UsersRepository usersRepository;

    public Users getUserFromJwt() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getClaim("email");

        Users user = usersRepository.findByEmail(email);
        return user;
    }

    public Map<String, Object> getUser(HttpServletRequest request) throws URISyntaxException, IOException, InterruptedException{
        Users user = getUserFromJwt();
        return usersRepository.userDataByEmail(user.getEmail());
    }

    public void editUser(HttpServletRequest request, String firstName, String lastName, String username, String bio, String profilePicture) throws URISyntaxException, IOException, InterruptedException{
        Users user = getUserFromJwt();

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

    public List < Map < String, Object > > getUsers(){
        Users user = getUserFromJwt();
        // if(user.getRole() != "admin"){
        //     throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient permissions");
        // }
        return usersRepository.getUsers();
    }

    public void adminEditUser(Integer userId, String role){
        Users user = getUserFromJwt();
        if(user.getRole() != "admin"){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient permissions");
        }
        role = role.strip().toLowerCase();
        if(role != "admin" && role != "field owner" && role != "player" && role != "captain"){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Role has to be of form: admin / field owner / player / captain");
        }
        Users editUser = usersRepository.findById(userId).get();
        
        editUser.setRole(role);
    }

    public void adminDeleteUser(Integer userId){
        Users user = getUserFromJwt();
        if(user.getRole() != "admin"){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient permissions");
        }

        Users deleteUser = usersRepository.findById(userId).get();
        
        deleteUser.setUsername("Deleted User");
        deleteUser.setEmail("Deleted User");
    }

    
}
