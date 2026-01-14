package com.zach.climblog.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zach.climblog.utils.Utils;
import com.zach.climblog.model.User;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class Climb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "climbs"}) // Prevent password from being serialized
    private User user;

    private String name;
    private String grade;
    private double difficulty;
    private String type; 
    private String gym;
    private boolean sent;
    private LocalDate date;

    public Climb() 
    {

    }

    public Climb(Long id, String name, String grade, int difficulty, String type, String gym, boolean sent, LocalDate date)
    {
        this.id = id;
        this.name = name;
        this.grade = grade;
        this.type = type;
        this.gym = gym;
        this.sent = sent;
        this.date = date;
    }

    public String getName()
    {
        return this.name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public Long getId()
    {
        return this.id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getType()
    {
        return this.type;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public String getGrade()
    {
        return this.grade;
    }

    public void setGrade(String grade)
    {
        this.grade = grade;
    }


    public double getDifficulty()
    {
        return this.difficulty;
    }

    public void setDifficulty(double difficulty)
    {
        this.difficulty = difficulty;
    }

    public void computeDifficulty()
    {
        this.difficulty = Utils.calcGrade(this.grade, this.type);
    }

    public String getGym()
    {
        return this.gym;
    }

    public void setGym(String gym)
    {
        this.gym = gym;
    }

    public boolean getSent()
    {
        return this.sent;
    }

    public void setSent(boolean sent)
    {
        this.sent = sent;
    }

    public LocalDate getDate()
    {
        return this.date;
    }

    public void setDate(LocalDate date)
    {
        this.date = date;
    }

    public User getUser()
    {
        return this.user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }

    @Override
    public String toString() 
    {
        return "Climb [name=" + name + ", type=" + type + ", difficulty=" + difficulty + ", gym=" + gym + ", grade=" + grade + 
        ", sent=" + sent + ", date=" + date + "]";
    }
}
