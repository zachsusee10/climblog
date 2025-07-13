package com.zach.climblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zach.climblog.model.Gym;

@Repository
public interface GymRepository extends JpaRepository<Gym, Long>{
    
}
