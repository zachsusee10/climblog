package com.zach.climblog.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zach.climblog.model.Climb;

@Repository
public interface ClimbRepository extends JpaRepository<Climb, Long> {

    //If i want to have advanced filtering on the frontend am i going to have to write 10000 queries here? fuck
    List<Climb> findByGrade(String grade);


    List<Climb> findByType(String type);


    List<Climb> findBySent(boolean sent);


    List<Climb> findByDate(LocalDate date);

    //FIXME: this is so incredibly stupid but i dont know springboot enough to write something better
    List<Climb> findTop1ByOrderByDateDesc();

    Climb findTop1ByOrderByDifficultyDesc();


}