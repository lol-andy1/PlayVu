package com.playvu.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.playvu.backend.entity.Game;


@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
}
    