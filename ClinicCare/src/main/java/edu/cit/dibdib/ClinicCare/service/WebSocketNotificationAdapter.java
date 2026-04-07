package edu.cit.dibdib.ClinicCare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class WebSocketNotificationAdapter implements NotificationAdapter {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendNotification(String topic, String message) {
        messagingTemplate.convertAndSend(topic, message);
    }
}
