package com.wheelio.service;

import com.wheelio.entity.AppUser;
import com.wheelio.entity.EmailTwoFactorCode;
import com.wheelio.repository.EmailTwoFactorCodeRepository;
import jakarta.transaction.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmailTwoFactorService {

    private static final int CODE_BOUND = 1_000_000;
    private static final int MAX_ATTEMPTS = 5;

    private final EmailTwoFactorCodeRepository codeRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();
    private final int expirationMinutes;
    private final String fromAddress;

    public EmailTwoFactorService(
            EmailTwoFactorCodeRepository codeRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder,
            @Value("${wheelio.email-2fa.expiration-minutes:10}") int expirationMinutes,
            @Value("${wheelio.email-2fa.from:no-reply@wheelio.local}") String fromAddress
    ) {
        this.codeRepository = codeRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.expirationMinutes = expirationMinutes;
        this.fromAddress = fromAddress;
    }

    @Transactional
    public void sendLoginCode(AppUser user) {
        codeRepository.markUnusedCodesAsUsed(user.getUserId());

        String code = generateCode();
        EmailTwoFactorCode twoFactorCode = new EmailTwoFactorCode();
        twoFactorCode.setUser(user);
        twoFactorCode.setCodeHash(passwordEncoder.encode(code));
        twoFactorCode.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        codeRepository.save(twoFactorCode);

        sendEmail(user, code);
    }

    @Transactional
    public void verifyLoginCode(AppUser user, String code) {
        EmailTwoFactorCode twoFactorCode = codeRepository
                .findFirstByUserUserIdAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                        user.getUserId(),
                        LocalDateTime.now()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid or expired verification code"
                ));

        if (twoFactorCode.getAttemptCount() >= MAX_ATTEMPTS) {
            twoFactorCode.setUsed(true);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Too many verification attempts");
        }

        if (!passwordEncoder.matches(code, twoFactorCode.getCodeHash())) {
            twoFactorCode.setAttemptCount(twoFactorCode.getAttemptCount() + 1);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired verification code");
        }

        twoFactorCode.setUsed(true);
    }

    private String generateCode() {
        return String.format("%06d", secureRandom.nextInt(CODE_BOUND));
    }

    private void sendEmail(AppUser user, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("Your Wheelio verification code");
        message.setText("""
                Your Wheelio verification code is %s.

                This code expires in %d minutes. If you did not try to log in, you can ignore this email.
                """.formatted(code, expirationMinutes));
        mailSender.send(message);
    }
}
