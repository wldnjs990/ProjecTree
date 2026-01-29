package com.ssafy.projectree.domain.member.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private String MAIL_CONTENT = "[ProjecTree] 초대 링크: ";
    private String MAIL_SUBJECT = "[ProjecTree] 워크스페이스에 초대되었습니다.";

    /**
     * workspace 초대 이메일 전송
     * @param to
     * @param text
     */
    public void sendEmail(String to, String text) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(MAIL_SUBJECT);
        message.setText(MAIL_CONTENT + text);

        mailSender.send(message);

    }

}
