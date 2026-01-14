package com.zach.climblog.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zach.climblog.model.Climb;
import com.zach.climblog.model.User;
import com.zach.climblog.service.ClimbService;
import com.zach.climblog.service.UserService;

@RestController
@RequestMapping("/api/climbs")
public class ClimbController {
    private final ClimbService climbService;
    private final UserService userService;

    public ClimbController(ClimbService climbService, UserService userService) {
        this.climbService = climbService;
        this.userService = userService;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        if (username == null || username.equals("anonymousUser")) {
            throw new RuntimeException("Invalid authentication");
        }
        User user = userService.findByUsername(username);
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<Climb> createClimb(@RequestBody Climb climb) 
    {
        try {
            Long userId = getCurrentUserId();
            User user = userService.findById(userId);
            
            climb.setUser(user);
            climb.setDifficulty(0);
            climb.computeDifficulty();
            Climb saved = climbService.addClimb(climb, userId);
            return ResponseEntity.status(201).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public List<Climb> getAllClimbs() 
    {
        Long userId = getCurrentUserId();
        return climbService.getAllClimbs(userId);
    }

    @GetMapping("/sent")
    public List<Climb> getSentClimbs() 
    {
        Long userId = getCurrentUserId();
        return climbService.getSentClimbs(userId);
    }

    @GetMapping("/bygrade")
    public List<Climb> getClimbsByGrade(@RequestParam String grade) 
    {
        Long userId = getCurrentUserId();
        return climbService.getClimbsByGrade(grade, userId);
    }

    @GetMapping("/bytype")
    public List<Climb> getClimbsByType(@RequestParam String type) 
    {
        Long userId = getCurrentUserId();
        return climbService.getClimbsByType(type, userId);
    }

    @GetMapping("/most-recent")
    public ResponseEntity<Climb> getMostRecentClimb()
    {
        try {
            Long userId = getCurrentUserId();
            Climb climb = climbService.getMostRecentClimb(userId);
            if (climb == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(climb);
        } catch (Exception e) {
            // If user not found or auth issue, return 404 (no data) instead of error
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/hardest-send")
    public ResponseEntity<Climb> getHardestSend()
    {
        try {
            Long userId = getCurrentUserId();
            Climb climb = climbService.getHardestClimb(userId);
            if (climb == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(climb);
        } catch (Exception e) {
            // If user not found or auth issue, return 404 (no data) instead of error
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Climb> updateClimb(@PathVariable Long id, @RequestBody Climb climb) 
    {
        try {
            Long userId = getCurrentUserId();
            climb.setDifficulty(0);
            Climb updated = climbService.updateClimb(id, climb, userId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClimb(@PathVariable Long id) 
    { 
        try {
            Long userId = getCurrentUserId();
            climbService.deleteClimb(id, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
