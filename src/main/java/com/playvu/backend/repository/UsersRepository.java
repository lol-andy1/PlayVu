package com.playvu.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.playvu.backend.entity.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {
}
    