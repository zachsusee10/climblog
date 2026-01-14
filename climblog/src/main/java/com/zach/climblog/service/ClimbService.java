package com.zach.climblog.service;

import java.time.LocalDate;
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

    public Climb addClimb(Climb climb, Long userId) 
    {
        // Ensure the climb is associated with the correct user
        if (climb.getUser() == null || !climb.getUser().getId().equals(userId)) {
            throw new RuntimeException("Climb must be associated with the authenticated user");
        }
        return climbRepository.save(climb);
    }

    public List<Climb> getAllClimbs(Long userId) 
    {
        return climbRepository.findByUserId(userId);
    }

    public List<Climb> getSentClimbs(Long userId) 
    {
        return climbRepository.findByUserIdAndSent(userId, true);
    }

    public List<Climb> getClimbsByType(String type, Long userId) 
    {
        return climbRepository.findByUserIdAndType(userId, type);
    }

    public List<Climb> getClimbsByGrade(String grade, Long userId) 
    {
        return climbRepository.findByUserIdAndGrade(userId, grade);
    }

    public List<Climb> getClimbsByDate(LocalDate date, Long userId) 
    {
        return climbRepository.findByUserIdAndDate(userId, date);
    }

    public Climb getMostRecentClimb(Long userId)
    {
        List<Climb> climbs = climbRepository.findTop1ByUserIdOrderByDateDesc(userId);
        return climbs.isEmpty() ? null : climbs.get(0);
    }

    public Climb getHardestClimb(Long userId)
    {
        Climb climb = climbRepository.findTop1ByUserIdOrderByDifficultyDesc(userId);
        // Only return if it's a sent climb
        return (climb != null && climb.getSent()) ? climb : null;
    }

    public void deleteClimb(Long id, Long userId) 
    {
        Climb climb = climbRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Climb not found with id: " + id));
        
        // Ensure user owns this climb
        if (!climb.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own climbs");
        }
        
        climbRepository.deleteById(id);
    }

    public Climb updateClimb(Long id, Climb updatedClimb, Long userId) 
    {
        Climb existingClimb = climbRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Climb not found with id: " + id));
        
        // Ensure user owns this climb
        if (!existingClimb.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only update your own climbs");
        }
        
        // Ensure updated climb is for the same user
        if (updatedClimb.getUser() != null && !updatedClimb.getUser().getId().equals(userId)) {
            throw new RuntimeException("Cannot change climb ownership");
        }
        
        existingClimb.setName(updatedClimb.getName());
        existingClimb.setGrade(updatedClimb.getGrade());
        existingClimb.setType(updatedClimb.getType());
        existingClimb.setGym(updatedClimb.getGym());
        existingClimb.setSent(updatedClimb.getSent());
        existingClimb.setDate(updatedClimb.getDate());
        // Always recompute difficulty server-side
        existingClimb.computeDifficulty();
        
        return climbRepository.save(existingClimb);
    }
}
