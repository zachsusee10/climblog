package com.zach.climblog.model;
import java.util.List;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;

@Entity
public class Climb {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String grade;
    private String type; 
    private String gym;
    private boolean sent;
    private LocalDate date;

    public Climb() 
    {

    }

    public Climb(Long id, String name, String grade, String type, String gym, boolean sent, LocalDate date)
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

    @Override
    public String toString() 
    {
        return "Climb [name=" + name + ", type=" + type + ", gym=" + gym + ", grade=" + grade + 
        ", sent=" + sent + ", date=" + date + "]";
    }
}
