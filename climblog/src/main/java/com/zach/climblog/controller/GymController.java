package com.zach.climblog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zach.climblog.model.Gym;
import com.zach.climblog.service.GymService;


@RestController
@RequestMapping("/gyms/api")
public class GymController {
    private final GymService gymService;

    public GymController(GymService gymService) {
        this.gymService = gymService;
    }

     @PostMapping("/addgym")
    public ResponseEntity<Gym> addGym(@RequestBody Gym gym) 
    {
        try {
            Gym saved = gymService.AddGym(gym);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
