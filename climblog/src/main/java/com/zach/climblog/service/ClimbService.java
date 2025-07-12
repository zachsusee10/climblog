package com.zach.climblog.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zach.climblog.model.Climb;
import com.zach.climblog.repository.ClimbRepository;

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
        return climbRepository.findAll();
    }

    public List<Climb> getSentClimbs() 
    {
        return climbRepository.findBySent(true);
    }

    public void deleteClimb(Long id) 
    {
        climbRepository.deleteById(id);
    }
}
