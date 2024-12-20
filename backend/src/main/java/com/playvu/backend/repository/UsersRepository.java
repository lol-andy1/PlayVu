package com.playvu.backend.repository;



import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.playvu.backend.entity.Users;


@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {
    Users findByEmail(String email);

    @Query(value = "SELECT user_id AS \"userId\", " +
                    "first_name AS \"firstName\", " +
                    "last_name AS \"lastName\", " +
                   "username AS \"username\", " +
                   "email AS \"email\", " +
                   "bio AS \"bio\", " +
                   "profile_picture AS \"profilePicture\", " +
                   "role "+
                   "FROM users WHERE email = :email", 
           nativeQuery = true)
    Map<String, Object> userDataByEmail(@Param("email") String email);

    @Query(value = "SELECT user_id AS \"userId\", " +
                    "first_name AS \"firstName\", " +
                    "last_name AS \"lastName\", " +
                   "username AS \"username\", " +
                   "email AS \"email\", " +
                   "bio AS \"bio\", " +
                   "profile_picture AS \"profilePicture\", " +
                   "role " +
                   "FROM users ORDER BY user_id ASC", 
           nativeQuery = true)
    List< Map<String, Object> > getUsers();

    @Query(value = "SELECT f.name, u.username from users u inner join field f on f.owner_id = u.user_id;", nativeQuery = true)
    List<Map<String, Object>> fieldOwnersUsernames();
}
    