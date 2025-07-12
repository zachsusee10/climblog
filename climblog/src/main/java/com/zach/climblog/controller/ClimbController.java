package com.zach.climblog.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zach.climblog.model.Climb;
import com.zach.climblog.service.ClimbService;

@RestController
@RequestMapping("/climbs")
public class ClimbController {
    private final ClimbService climbService;

    public ClimbController(ClimbService climbService) {
        this.climbService = climbService;
    }

    @PostMapping("api/addclimb")
    public ResponseEntity<Climb> addClimb(@RequestBody Climb climb) 
    {
        try {
            Climb saved = climbService.addClimb(climb);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("api/allclimbs")
    public List<Climb> getAllClimbs() 
    {
        return climbService.getAllClimbs();
    }

    @GetMapping("api/sent")
    public List<Climb> getSentClimbs() 
    {
        return climbService.getSentClimbs();
    }

    @DeleteMapping("api/{id}")
    public ResponseEntity<?> deleteClimb(@PathVariable Long id) 
    { 
        try {
            climbService.deleteClimb(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // handle exception if id isnt in db??
            return ResponseEntity.status(500).build();
        }
    }
}
