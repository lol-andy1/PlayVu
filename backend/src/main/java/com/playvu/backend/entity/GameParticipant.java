package com.playvu.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table()
public class GameParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Integer gameParticipantId;

    @Column(nullable = false)
    private Integer gameId;

    @Column(nullable = false)
    private Integer participantId;

    @Column()
    private Integer team;

    @Column()
    private Integer playTime;

    @Column()
    private LocalDateTime playStart;

    public Integer getGameParticipantId() {
        return gameParticipantId;
    }

    public void setGameParticipantId(Integer gameParticipantId) {
        this.gameParticipantId = gameParticipantId;
    }

    public Integer getGameId() {
        return gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public Integer getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Integer participantId) {
        this.participantId = participantId;
    }

    public Integer getTeam() {
        return team;
    }

    public void setTeam(Integer team) {
        this.team = team;
    }  

    public Integer getPlayTime() {
        return playTime;
    }

    public void setPlayTime(Integer playTime) {
        this.playTime = playTime;
    }  

    public void addToPlayTime(Integer playTime) {
        this.playTime += playTime;
    } 

    public LocalDateTime getPlayStart() {
        return playStart;
    }

    public void setPlayStart(LocalDateTime playStart) {
        this.playStart = playStart;
    }  
}
