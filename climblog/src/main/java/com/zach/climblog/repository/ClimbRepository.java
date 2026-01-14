package com.zach.climblog.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zach.climblog.model.Climb;

@Repository
public interface ClimbRepository extends JpaRepository<Climb, Long> {

    // User-filtered queries
    List<Climb> findByUserId(Long userId);
    List<Climb> findByUserIdAndGrade(Long userId, String grade);
    List<Climb> findByUserIdAndType(Long userId, String type);
    List<Climb> findByUserIdAndSent(Long userId, boolean sent);
    List<Climb> findByUserIdAndDate(Long userId, LocalDate date);
    List<Climb> findTop1ByUserIdOrderByDateDesc(Long userId);
    Climb findTop1ByUserIdOrderByDifficultyDesc(Long userId);

    // Legacy methods, breaking if i get rid of some so just leaving
    @Deprecated
    List<Climb> findByGrade(String grade);
    @Deprecated
    List<Climb> findByType(String type);
    @Deprecated
    List<Climb> findBySent(boolean sent);
    @Deprecated
    List<Climb> findByDate(LocalDate date);
    @Deprecated
    List<Climb> findTop1ByOrderByDateDesc();
    @Deprecated
    Climb findTop1ByOrderByDifficultyDesc();

}