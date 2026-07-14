package com.wheelio.repository;

import com.wheelio.entity.EmailTwoFactorCode;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmailTwoFactorCodeRepository extends JpaRepository<EmailTwoFactorCode, Long> {

    Optional<EmailTwoFactorCode> findFirstByUserUserIdAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            Long userId,
            LocalDateTime now
    );

    @Modifying
    @Query("""
            UPDATE EmailTwoFactorCode code
            SET code.used = true
            WHERE code.user.userId = :userId
              AND code.used = false
            """)
    void markUnusedCodesAsUsed(@Param("userId") Long userId);
}
