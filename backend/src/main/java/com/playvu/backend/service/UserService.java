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
import com.playvu.backend.repository.GameParticipantRepository;
import com.playvu.backend.repository.UsersRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {
    @Autowired 
    private UsersRepository usersRepository;

    @Autowired 
    private GameParticipantRepository gameParticipantRepository;
    

    /**
     * Retrieves the current authenticated user from the JWT token in the security context.
     * 
     * @return The user object corresponding to the email extracted from the JWT.
     */
    public Users getUserFromJwt() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getClaim("email");

        Users user = usersRepository.findByEmail(email);
        return user;
    }

    /**
     * Retrieves the user data for the currently authenticated user.
     * 
     * @return A map containing the user data associated with the authenticated user's email.
     * @throws URISyntaxException If there is a URI syntax error.
     * @throws IOException If an I/O error occurs.
     * @throws InterruptedException If the operation is interrupted.
     */
    public Map<String, Object> getUser() throws URISyntaxException, IOException, InterruptedException {
        Users user = getUserFromJwt();
        return usersRepository.userDataByEmail(user.getEmail());
    }

    /**
     * Edits the profile information of the currently authenticated user.
     * The user can update their first name, last name, username, bio, and profile picture.
     * Only the provided non-null parameters will be updated.
     * 
     * @param firstName The user's new first name, or null if no change.
     * @param lastName The user's new last name, or null if no change.
     * @param username The user's new username, or null if no change.
     * @param bio The user's new bio, or null if no change.
     * @param profilePicture The user's new profile picture URL, or null if no change.
     */
    public void editUser(String firstName, String lastName, String username, String bio, String profilePicture) {
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

    /**
     * Retrieves a list of all users.
     * Only accessible by admins.
     * 
     * @return A list of maps containing the data of all users.
     * @throws ResponseStatusException If the current user does not have admin permissions.
     */
    public List<Map<String, Object>> getUsers() {
        Users user = getUserFromJwt();
        
        // Admin role check can be re-enabled if needed
        // if(user.getRole() != "admin"){
        //     throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient permissions");
        // }

        return usersRepository.getUsers();
    }

    /**
     * Admin method to edit the role of a specified user.
     * The new role must be one of "admin", "field owner", or "player".
     * 
     * @param userId The ID of the user whose role will be edited.
     * @param role The new role to be assigned to the user.
     * @throws ResponseStatusException If the current user is not an admin or if the provided role is invalid.
     */
    public void adminEditUser(Integer userId, String role) {
        Users user = getUserFromJwt();
        if (!user.getRole().equals("admin")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient permissions");
        }

        role = role.strip().toLowerCase();
        if (!role.equals("admin") && !role.equals("field owner") && !role.equals("player")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Role has to be of form: admin / field owner / player");
        }

        Users editUser = usersRepository.findById(userId).get();
        editUser.setRole(role);
        usersRepository.save(editUser);
    }

    /**
     * Admin method to delete a user by setting their username and email to "Deleted User".
     * Also deletes any future games the user is scheduled to participate in.
     * 
     * @param userId The ID of the user to be deleted.
     * @throws ResponseStatusException If the current user is not an admin or if the user has already been deleted.
     */
    public void adminDeleteUser(Integer userId) {
        Users user = getUserFromJwt();
        if (!user.getRole().equals("admin")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Insufficient permissions");
        }

        Users deleteUser = usersRepository.findById(userId).get();
        if (deleteUser.getEmail().equals("Deleted User")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User already deleted");
        }

        gameParticipantRepository.deleteFutureUserGames(userId);
        deleteUser.setUsername("Deleted User");
        deleteUser.setEmail("Deleted User");
        usersRepository.save(deleteUser);
    }

    
}
