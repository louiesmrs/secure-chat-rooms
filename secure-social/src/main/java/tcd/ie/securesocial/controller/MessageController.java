package tcd.ie.securesocial.controller;
import tcd.ie.securesocial.service.MessageDto;
import tcd.ie.securesocial.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @MessageMapping("/message/{roomName}")
    @SubscribeMapping("/message/{roomName}")
    @SendTo("/topic/message/{roomName}")
    public MessageDto postMessage(MessageDto messageDto) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
        System.out.println("Message Received");
        System.out.println(messageDto);
        return messageService.saveMessage(messageDto);
    }

    @GetMapping("/message")
    public ResponseEntity<List<MessageDto>> getAllMessages() {
        List<MessageDto> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/message/{roomName}")
    public ResponseEntity<List<MessageDto>> getMessagesByRoom(@PathVariable String roomName) {
        List<MessageDto> messages = messageService.getMessagesByRoom(roomName);
        return ResponseEntity.ok(messages);
    }

}