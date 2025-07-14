package com.zach.climblog.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.zach.climblog.model.Climb;
import com.zach.climblog.repository.ClimbRepository;
import com.zach.climblog.utils.Utils;

@Service
public class ClimbService {
    private final ClimbRepository climbRepository;

    public ClimbService(ClimbRepository climbRepository) 
    {
        this.climbRepository = climbRepository;
    }

    public Climb addClimb(Climb climb) 
    {
        return climbRepository.save(climb);
    }

    public List<Climb> getAllClimbs() 
    {

        System.out.println(climbRepository.findAll());
        return climbRepository.findAll();
    }

    public List<Climb> getSentClimbs() 
    {
        return climbRepository.findBySent(true);
    }

    public List<Climb> getClimbsByType(String type) 
    {
        return climbRepository.findByType(type);
    }

    public List<Climb> getClimbsByGrade(String grade) 
    {
        return climbRepository.findByGrade(grade);
    }

    public List<Climb> getClimbsByDate(LocalDate date) 
    {
        return climbRepository.findByDate(date);
    }

    public List<Climb> getMostRecentClimb()
    {
        return climbRepository.findTop1ByOrderByDateDesc();
    }

    public Climb getHardestClimb()
    {
        return climbRepository.findTop1ByOrderByDifficultyDesc();
    }


    public void deleteClimb(Long id) 
    {
        climbRepository.deleteById(id);
    }
}
