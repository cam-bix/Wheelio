package com.wheelio.repository;

import com.wheelio.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findAllByOrderByCreatedAtDesc();

    @Query(
            value = """
                    SELECT employee_id
                    FROM employee
                    WHERE employment_status = 'ACTIVE'
                    ORDER BY RANDOM()
                    LIMIT 1
                    """,
            nativeQuery = true
    )
    Optional<Long> findRandomActiveEmployeeId();
}
