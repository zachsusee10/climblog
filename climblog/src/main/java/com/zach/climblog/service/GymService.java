package com.zach.climblog.service;

import org.springframework.stereotype.Service;

import com.zach.climblog.model.Gym;
import com.zach.climblog.repository.GymRepository;

@Service
public class GymService {
    private final GymRepository gymRepository;

    public GymService(GymRepository gymRepository) 
    {
        this.gymRepository = gymRepository;
    }

    public Gym AddGym(Gym gym) 
    {
        return gymRepository.save(gym);
    }


}
