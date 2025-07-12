package com.zach.climblog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zach.climblog.model.Climb;

@Repository
public interface ClimbRepository extends JpaRepository<Climb, Long> {
    List<Climb> findByGrade(String grade);
    List<Climb> findBySent(boolean sent);
}